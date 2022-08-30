//import { IPC } from 'node-ipc';
import { Pricelist, PricelistItem } from "../common/types/pricelist";

import fs from "fs";

const tls = require("tls");

import { TLSSocket, Server } from "tls";

class CustomTLSSocket extends TLSSocket {
  socket;
  id;

  constructor(socket, options?) {
    super(socket, options);
    Object.setPrototypeOf(this, CustomTLSSocket.prototype);
    this.socket = socket;
  }

  public writeJson = function (event: String, data?) {
    console.log(event);

    if (data && typeof data === "string")
      this.socket.write(JSON.stringify({ event: event, data: data }));

    if (data)
      this.socket.write(
        JSON.stringify({ event: event, data: JSON.stringify(data) })
      );
    else this.socket.write(JSON.stringify({ event: event, data: "" }));

    console.log(JSON.stringify({ event: event, data: JSON.stringify(data) }));
  };
}

export default class BotConnectionManager {
  bots: {
    [id: string]: {
      socket: CustomTLSSocket;
      pricelistTS?: number;
      pricelist?: Pricelist;
      admins?: string[];
      id: string;
      name: string;
    };
  };

  private initiated: boolean;

  private tlsServer: Server;

  constructor() {
    if (
      !fs.existsSync(`${process.cwd()}/cert/server.pub`) ||
      !fs.existsSync(`${process.cwd()}/cert/server.key`)
    ) {
      //no keys found, generate them
      const { generateKeyPairSync } = require("crypto");
      const { publicKey, privateKey } = generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      });
      fs.writeFileSync(`${process.cwd()}/cert/server.pub`, publicKey);
      fs.writeFileSync(`${process.cwd()}/cert/server.key`, privateKey);
    }

    var botConnectionManager = this;

    this.tlsServer = tls.createServer(
      {
        key: fs.readFileSync(`${process.cwd()}/cert/server.key`),
        cert: fs.readFileSync(`${process.cwd()}/cert/server.pub`),
      },
      function (socket: CustomTLSSocket) {
        socket = new CustomTLSSocket(socket);

        socket.on("data", function (json) {
          switch (json.event) {
            case "info":
              if (!botConnectionManager.bots[json.data.id]) {
                console.log("bot id " + json.data.id);
                socket.id = json.data.id;
                botConnectionManager.bots[json.data.id] = {
                  socket,
                  ...json.data,
                };
              }
              break;
            case "pricelist":
              if (!json.data) {
                setTimeout(
                  () => botConnectionManager.getPricelist(socket),
                  3000
                );
              } else {
                console.log("NEW PRICELiST");
                console.log(json.data);
                botConnectionManager.bots[socket.id]["pricelist"] = json.data;
                botConnectionManager.bots[socket.id]["pricelistTS"] =
                  Date.now();
              }
              break;
            case "drop":
              delete botConnectionManager.bots[socket.id];
              break;
            default:
              console.log(
                "Received: %s",
                JSON.stringify(json).replace(/(\n)/gm, "")
              );
          }
        });
      }
    );
    this.bots = {};
    this.initiated = false;
  }

  private getPricelist(socket: CustomTLSSocket, callback?) {
    socket = new CustomTLSSocket(socket);
    socket.writeJson("getPricelist");
    if (callback) {
      socket.once("pricelist", callback);
    }
  }
  private getInfo(socket: CustomTLSSocket, callback?) {
    socket.writeJson("getInfo");
    if (callback) {
      console.log(callback);
      socket.once("info", callback);
    }
  }

  static cleanItem(item) {
    return {
      sku: item.sku,
      enabled: item.enabled,
      autoprice: item.autoprice,
      min: item.min,
      max: item.max,
      intent: parseInt(item?.intent),
      buy: { keys: item.buy?.keys, metal: item.buy?.metal },
      sell: { keys: item.sell?.keys, metal: item.sell?.metal },
      promoted: item.promoted,
      group: item.group,
      note: { buy: item.note.buy, sell: item.note.sell },
      isPartialPriced: item.isPartialPriced,
    };
  }

  getBotPricelist(id: string) {
    return new Promise<undefined | Pricelist>((resolve, reject) => {
      if (!this.bots[id]) reject("no bot found");
      else if (this.bots[id].pricelistTS > Date.now() - 15 * 1000) {
        resolve(this.bots[id].pricelist);
      } else {
        this.getPricelist(this.bots[id].socket, (data) => {
          resolve(data);
        });
      }
    });
  }
  getOptions(id: string) {
    return new Promise<undefined | PricelistItem>((resolve, reject) => {
      if (!this.bots[id]) reject("no bot found");
      else {
        this.bots[id].socket.writeJson("getOptions");
        this.bots[id].socket.once("options", resolve);
      }
    });
  }
  updateOptions(id: string, options: object) {
    return new Promise<undefined | PricelistItem>((resolve, reject) => {
      if (!this.bots[id]) reject("no bot found");
      else {
        this.bots[id].socket.writeJson(`updateOptions`, options);
        this.bots[id].socket.once("optionsUpdated", resolve);
      }
    });
  }
  addItem(id: string, item: object) {
    return new Promise<undefined | PricelistItem>((resolve, reject) => {
      if (!this.bots[id]) reject("no bot found");
      else {
        this.bots[id].socket.writeJson(
          "addItem",
          BotConnectionManager.cleanItem(item)
        );
        this.bots[id].socket.once("itemAdded", resolve);
      }
    });
  }
  updateItem(id: string, item: object) {
    return new Promise<undefined | PricelistItem>((resolve, reject) => {
      if (!this.bots[id]) reject("no bot found");
      else {
        this.bots[id].socket.writeJson(
          "updateItem",
          BotConnectionManager.cleanItem(item)
        );
        this.bots[id].socket.once("itemUpdated", resolve);
      }
    });
  }
  removeItem(id: string, sku: string) {
    return new Promise<undefined | PricelistItem>((resolve, reject) => {
      if (!this.bots[id]) reject("no bot found");
      else {
        this.bots[id].socket.writeJson("removeItem", sku);
        this.bots[id].socket.once("itemRemoved", resolve);
      }
    });
  }

  getTrades(id: string) {
    return new Promise<undefined | PricelistItem>((resolve, reject) => {
      if (!this.bots[id]) reject("no bot found");
      else {
        this.bots[id].socket.writeJson("getTrades");
        this.bots[id].socket.once("polldata", resolve); //TODO: cache
      }
    });
  }

  sendChat(id: string, message: string) {
    return new Promise<string>((resolve, reject) => {
      if (!this.bots[id]) reject("this bot does not exist");
      else {
        this.bots[id].socket.writeJson("sendChat", message);
        this.bots[id].socket.once("chatResp", resolve);
      }
    });
  }

  init() {
    const PORT = 8000;
    const HOST = "127.0.0.1";

    // Start listening on a specific port and address
    this.tlsServer.listen(PORT, HOST, function () {
      this.initiated = true;
      console.log("I'm listening at %s, on port %s", HOST, PORT);
    });

    this.tlsServer.on("secureConnection", (socket: CustomTLSSocket) => {
      socket = new CustomTLSSocket(socket);
      console.log("Requesting info");
      this.getInfo(socket);
    });

    this.tlsServer.on("end", function () {
      console.log("EOT (End Of Transmission)");
    });

    this.tlsServer.on("error", function (error) {
      console.error(error);
      this.tlsServer.close();
    });
  }
}
