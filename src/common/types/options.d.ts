//TODO: Complete list. If it's even needed. /shrug
export type BotOptions = {
    miscSettings: {
        showOnlyMetal:{
            enable: boolean
        },
        sortInventory: {
            enable: boolean,
            type: number
        },
        createListings: {
            enable: boolean
        },
        addFriends: {
            enable: boolean
        },
        sendGroupInvite: {
            enable: boolean
        },
        counterOffer: {
            enable: boolean,
            skipIncludeMessage: boolean
        },
        skipItemsInTrade: {
            enable: boolean
        },
        weaponsAsCurrency: {
            enable: boolean,
            withUncraft: boolean
        },
        checkUses: {
            duel: boolean,
            noiseMaker: boolean
        },
        game: {
            playOnlyTF2: boolean,
            customName: string
        },
        alwaysRemoveItemAttributes: {
            customTexture: {
                enable: boolean
            }
        },
        deleteUntradableJunk: {
            enable: boolean
        },
        reputationCheck: {
            checkMptfBanned: boolean,
            reptfAsPrimarySource: boolean
        },
        pricecheckAfterTrade: {
            enable: boolean
        }
    },
    sendAlert: {
        enable: boolean,
        autokeys: {
            lowPure: boolean,
            failedToAdd: boolean,
            failedToUpdate: boolean,
            failedToDisable: boolean
        }
        backpackFull: boolean,
        highValue: {
            gotDisabled: boolean,
            receivedNotInPricelist: boolean,
            tryingToTake: boolean
        },
        autoRemoveIntentSellFailed: boolean,
        autoAddPaintedItems: boolean,
        failedAccept: boolean,
        unableToProcessOffer: boolean,
        partialPrice: {
            onUpdate: boolean,
            onSuccessUpdatePartialPriced: boolean,
            onFailedUpdatePartialPriced: boolean,
            onBulkUpdatePartialPriced: boolean,
            onResetAfterThreshold: boolean
        },
        receivedUnusualNotInPricelist: boolean,
        failedToUpdateOldPrices: boolean
    },
    pricelist: {
        partialPriceUpdate: {
            enable: boolean,
            thresholdInSeconds: number,
            excludeSku: [string]
        },
        filterCantAfford: {
            enable: boolean
        },
        autoRemoveIntentSell: {
            enable: boolean
        },
        autoAddInvalidItems: {
            enable: boolean
        }
        autoAddInvalidUnusual: {
            enable: boolean
        }
        autoAddPaintedItems: {
            enable: boolean
        }
        priceAge: {
            maxInSeconds: number
        }
    },
    bypass: {
        escrow: {
            allow: boolean
        },
        overpay: {
            allow: boolean
        },
        giftWithoutMessage: {
            allow: boolean
        }
    },
    tradeSummary: {
        declinedTrade: {
            enable: boolean
        }
        showStockChanges: boolean,
        showTimeTakenInMS: boolean,
        showDetailedTimeTaken: boolean,
        showItemPrices: boolean,
        showPureInEmoji: boolean,
        showProperName: boolean,
        showOfferMessage: boolean,
        customText: {
            summary: {
                steamChat: string,
                discordWebhook: string
            },
            asked: {
                steamChat: string,
                discordWebhook: string
            },
            offered: {
                steamChat: string,
                discordWebhook: string
            },
            offerMessage: {
                steamChat: string,
                discordWebhook: string
            },
            profitFromOverpay: {
                steamChat: string,
                discordWebhook: string
            },
            lossFromUnderpay: {
                steamChat: string,
                discordWebhook: string
            },
            timeTaken: {
                steamChat: string,
                discordWebhook: string
            },
            keyRate: {
                steamChat: string,
                discordWebhook: string
            },
            pureStock: {
                steamChat: string,
                discordWebhook: string
            },
            totalItems: {
                steamChat: string,
                discordWebhook: string
            },
            spells: string,
            strangeParts: string,
            killstreaker: string,
            sheen: string,
            painted: string
        }
    },
    steamChat: {
        customInitializer: {
            acceptedTradeSummary: string,
            declinedTradeSummary: string,
            review: string,
            message: {
                onReceive: string,
                toOtherAdmins: string
            }
        },
        notifyTradePartner: {
            onSuccessAccepted: boolean,
            onSuccessAcceptedEscrow: boolean,
            onDeclined: boolean,
            onCancelled: boolean,
            onTradedAway: boolean,
            onOfferForReview: boolean
        }
    },
    highValue: {
        enableHold: boolean,
        spells: {
            names: [string],
            exceptionSkus: [string]
        },
        sheens: {
            names: [string],
            exceptionSkus: [string]
        },
        killstreakers: {
            names: [string],
            exceptionSkus: [string]
        },
        strangeParts: {
            names: [string],
            exceptionSkus: [string]
        },
        painted: {
            names: [string],
            exceptionSkus: [string]
        }
    },
    normalize: {
        //TODO: Complete. If they even need this.
    }
}