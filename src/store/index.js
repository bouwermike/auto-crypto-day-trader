import Vue from 'vue'
import Vuex from 'vuex'
import seedrandom from 'seedrandom'
import axios from 'axios'
import {
  format
} from 'fecha';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    game_start_time: 0,
    initial_funds: 0,
    random_seed: "",
    ready: false,
    mental_health: 10,
    pairs: [],
    bank_account: 0,
    current_portfolio_value: 0,
    current_funds: [],
    events: []
  },
  mutations: {
    changeReadyState(state) {
      state.ready ? false : state.ready = true
      state.game_start_time = format(Date.now(), 'YYYY-MM-DD hh:mm')
    },
    setSeed(state, payload) {
      state.random_seed = payload
    },
    setStartFunds(state, payload) {
      state.bank_account = payload
      state.initial_funds = payload
    },
    setExchangeInfo(state, payload) {
      state.pairs = payload
    },
    pushEvent(state, payload) {
      state.events.push({
        time: format(Date.now(), 'YYYY-MM-DD hh:mm'),
        event: payload.string,
        type: payload.type
      })
    },
    updateMentalHealth(state, payload) {
      state.mental_health += payload
    },
    processBankAccountTransaction(state, payload) {
      let index = state.current_funds.findIndex(i => i.symbol === payload.symbol_bought)
      index > -0.5 ? state.current_funds[index].amt += payload.amount_bought : state.current_funds.push({
        symbol: payload.symbol_bought,
        amt: payload.amount_bought
      })
      state.bank_account -= payload.cost
    },
    processCryptoTransaction(state, payload) {
      let buy_index = state.current_funds.findIndex(i => i.symbol === payload.symbol_bought)
      let sell_index = state.current_funds.findIndex(i => i.symbol === payload.symbol_sold)
      if (buy_index > -0.5) {
        state.current_funds[buy_index].amt += payload.amount_bought
        state.current_funds[sell_index].amt -= payload.cost
      } else {
        state.current_funds.push({
          symbol: payload.symbol_bought,
          amt: payload.amount_bought
        })
        state.current_funds[sell_index].amt -= payload.cost
      }

    }
  },
  getters: {
    roundedBankAccount: state => {
      return state.bank_account.toFixed(2)
    }
  },
  actions: {
    async initialise(context) {
      let joke = await axios.get("https://official-joke-api.appspot.com/random_joke")
      let seed = joke.data.punchline
      let rng = seedrandom(seed);
      let startfunds = Math.floor(rng() * 10000)

      let exchange_info = await axios.get('https://api.binance.com/api/v3/exchangeInfo')

      let pairs = exchange_info.data.symbols.map(i => {
        return {
          symbol: i.symbol,
          base: i.baseAsset,
          quote: i.quoteAsset
        }
      })

      context.commit('setExchangeInfo', pairs)
      context.commit("setSeed", seed)
      context.commit("setStartFunds", startfunds)
      context.commit("pushEvent", {
        string: "You inherit $" + startfunds + " from your estranged cousin.",
        type: 'narrative'
      })
      context.commit("changeReadyState")

      setTimeout(() => {
        context.dispatch("startGame")
      }, 1500);
    },
    startGame(context) {
      setTimeout(() => {
        let story = "You take your friends out to celebrate. You get drunk. You decide to quit your job and start crypto day trading. Your drunk friends approve."
        context.commit("pushEvent", {
          string: story,
          type: 'narrative'
        })
        context.dispatch("stepGame")
      }, 1500);
    },
    async stepGame(context) {
      let rng = seedrandom(context.state.random_seed, {
        entropy: true
      })
      let roll = rng()
      let timeout = Math.floor(rng() * 500 * context.state.mental_health)
      let prices = await axios.get("https://api.binance.com/api/v3/ticker/price")
      // Attempt a transaction if the roll is greater than 0.6
      if (roll >= 0.6) {
        let pairs = context.state.pairs
        //if roll is greater than 0.8, attempt a bank account transaction
        if (roll >= 0.75) {
          if (context.state.bank_account > 1) {
            let USDTPairs = pairs.filter(i => i.quote === 'USDT')
            let random_USDT_pair = USDTPairs[Math.floor(rng() * USDTPairs.length)]
            let price = prices.data.find(i => i.symbol === random_USDT_pair.symbol)

            let max_amount = context.state.bank_account / price.price
            let buy_amount = max_amount * rng()

            let transaction = {
              symbol_bought: random_USDT_pair.base,
              amount_bought: buy_amount,
              price: price.price,
              cost: (buy_amount * price.price).toFixed(2)
            }
            context.commit("pushEvent", {
              string: `Executed a trade. Bought ${transaction.amount_bought} ${transaction.symbol_bought} at ${transaction.price} ${transaction.symbol_bought}/USD for a total cost of $${transaction.cost}.`,
              type: 'trade'
            })
            context.commit("processBankAccountTransaction", transaction)
            setTimeout(() => {
              context.dispatch("stepGame")
            }, timeout);
          } else {
            setTimeout(() => {
              context.dispatch("stepGame")
            }, timeout);
          }
        }
        //if roll is greater than 0.7 but less than 0.85, attempt a crypto trade
        else {
          try {
            if (!context.state.current_funds.length) {
              context.dispatch("stepGame")
            } else {
              let random_coin = context.state.current_funds[Math.floor(rng() * context.state.current_funds.length)]
              let random_coin_pairs = pairs.filter(i => i.base === random_coin.symbol)
              let random_coin_pair = random_coin_pairs[Math.floor(rng() * random_coin_pairs.length)]

              let price = prices.data.find(i => i.symbol === random_coin_pair.symbol)

              let max_amount = random_coin.amt * price.price

              let buy_amount = max_amount * rng()

              let transaction = {
                symbol_sold: random_coin_pair.base,
                symbol_bought: random_coin_pair.quote,
                amount_bought: buy_amount,
                cost: buy_amount / price.price,
                price: price.price
              }

              context.commit("pushEvent", {
                string: `Executed a trade. Bought ${transaction.amount_bought} ${transaction.symbol_bought} at ${transaction.price} ${transaction.symbol_bought}/${transaction.symbol_sold} for a total cost of ${transaction.cost} ${transaction.symbol_sold}.`,
                type: 'trade'
              })
              context.commit("processCryptoTransaction", transaction)
              setTimeout(() => {
                context.dispatch("stepGame")
              }, timeout);

            }
          } catch (error) {
            context.dispatch("stepGame")
          }

        }
      }
      // Else, provide a narrative evolution
      else {
        let narrative_points = [{
            string: "Oh no! You started micro-dosing!",
            amt: -1
          },
          {
            string: "You try some cocaine on a night out with friends. Dangerous!",
            amt: -3
          },
          {
            string: "You listen to 19 straight hours of a Joe Rogan podcast.",
            amt: -2
          },
          {
            string: "You actually attend a forest rave. A stranger gives you an unknown substance. You consume the substance.",
            amt: -3
          },
          {
            string: "You go on a date. They think your day trading is 'irresponsible'. You go home to cry.",
            amt: -3
          },
          {
            string: "Your friend introduces you to a stranger as being a 'crypto genius'. No one has ever said anything nicer.",
            amt: 3
          },
          {
            string: "You buy tickets to a forest rave. You're very excited.",
            amt: 2
          },
          {
            string: "You wake up early and go for a hike. The sunrise is spectacular. You feel like a weight has been lifted off you.",
            amt: 3
          },
          {
            string: "Your mother calls you. She's worried, but says she will always love you.",
            amt: 2
          },
          {
            string: "You're planning your next move.",
            amt: 0
          }
        ]
        setTimeout(() => {
          let narrative_point = narrative_points[Math.floor(rng() * narrative_points.length)]
          context.commit("pushEvent", {
            string: narrative_point.string + " Mental health changed by " + narrative_point.amt + ".",
            type: 'narrative'
          })
          context.commit("updateMentalHealth", narrative_point.amt)
          context.dispatch("stepGame")
        }, timeout);
      }



    }
  },
  modules: {}
})