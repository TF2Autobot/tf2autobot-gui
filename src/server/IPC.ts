//import { IPC } from 'node-ipc';
import { Pricelist, PricelistItem } from "../common/types/pricelist";
import fs from "fs";
import { generateKeyPairSync } from "crypto";
import path from "path";

const tls = require("tls");

export default class BotConnectionManager {
  bots: {
    [id: string]: {
      socket: any;
      pricelistTS?: number;
      pricelist?: Pricelist;
      admins?: string[];
      id: string;
    };
  };

  private initiated: boolean;

  private socket: typeof tls.Server;

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

    this.socket = tls.createServer(
      {
        key: fs.readFileSync(`${process.cwd()}/cert/server.key`),
        cert: fs.readFileSync(`${process.cwd()}/cert/server.pub`),
      },
      function (socket) {
        // Send a friendly message
        socket.write("I am the server sending you a message.");

        // Print the data that we received
        socket.on("data", function (data) {
          console.log(
            "Received: %s [it is %d bytes long]",
            data.toString().replace(/(\n)/gm, ""),
            data.length
          );
        });

        // Let us know when the transmission is over
        socket.on("end", function () {
          console.log("EOT (End Of Transmission)");
        });
      }
    );
    this.bots = {};
    this.initiated = false;
  }

  private getPricelist(socket, callback?) {
    this.socket.emit(socket, "getPricelist");
    if (callback) {
      this.socket.once("pricelist", callback);
    }
  }
  private getInfo(socket, callback?) {
    this.socket.emit(socket, "getInfo");
    if (callback) {
      this.socket.once("info", callback);
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
  addItem(id: string, item: object) {
    return new Promise<undefined | PricelistItem>((resolve, reject) => {
      if (!this.bots[id]) reject("no bot found");
      else {
        this.socket.emit(
          this.bots[id].socket,
          "addItem",
          BotConnectionManager.cleanItem(item)
        );
        this.socket.once("itemAdded", resolve);
      }
    });
  }
  updateItem(id: string, item: object) {
    return new Promise<undefined | PricelistItem>((resolve, reject) => {
      if (!this.bots[id]) reject("no bot found");
      else {
        this.socket.emit(
          this.bots[id].socket,
          "updateItem",
          BotConnectionManager.cleanItem(item)
        );
        this.socket.once("itemUpdated", resolve);
      }
    });
  }
  removeItem(id: string, sku: string) {
    return new Promise<undefined | PricelistItem>((resolve, reject) => {
      if (!this.bots[id]) reject("no bot found");
      else {
        this.socket.emit(this.bots[id].socket, "removeItem", sku);
        this.socket.once("itemRemoved", resolve);
      }
    });
  }

  getTrades(id: string) {
    return new Promise<undefined | PricelistItem>((resolve, reject) => {
      if (!this.bots[id]) reject("no bot found");
      else {
        this.socket.emit(this.bots[id].socket, "getTrades");
        this.socket.once("polldata", resolve); //TODO: cache
      }
    });
  }

  sendChat(id: string, message: string) {
    return new Promise<string>((resolve, reject) => {
      if (!this.bots[id]) reject("this bot does not exist");
      else {
        this.socket.emit(this.bots[id].socket, "sendChat", message);
        this.socket.once("chatResp", resolve);
      }
    });
  }

  init() {
    const PORT = 8000;
    const HOST = "127.0.0.1";

    // Start listening on a specific port and address
    this.socket.listen(PORT, HOST, function () {
      this.initiated = true;
      console.log("I'm listening at %s, on port %s", HOST, PORT);
    });

    // When an error occurs, show it.
    this.socket.on("error", function (error) {
      console.error(error);

      // Close the connection after the error occurred.
      this.socket.destroy();
    });
    this.socket.on("info", (data, socket) => {
      if (!this.bots[data.id]) {
        console.log("bot id " + data.id);
        socket.id = data.id;
        this.bots[data.id] = { socket, ...data };
      }
    });
    this.socket.on("pricelist", (data, socket) => {
      if (!data) {
        setTimeout(() => this.getPricelist(socket), 3000);
      } else {
        console.log("NEW PRICELiST");
        console.log(data);
        this.bots[socket.id]["pricelist"] = data;
        this.bots[socket.id]["pricelistTS"] = Date.now();
      }
    });
    this.socket.on("connect", (socket) => {
      this.getInfo(socket);
    });
    this.socket.on("socket.disconnected", (socket) => {
      delete this.bots[socket.id];
    });
  }
}
