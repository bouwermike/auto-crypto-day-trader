<template>
  <div class="center">
    <h1>Auto Crypto Day Trader</h1>
    <h1 class="button" @click="() => this.$router.push('game')">START</h1>
    <p class="anchor" @click="() => show_more = true">What is this game about?</p>
    <p v-show="show_more" class="about">
      Auto Crypto Day Trader is an automated RPG where you follow the fortune of a Day Trader as they enter the dangerous world of crypto-trading.
      After inheriting a random amount of money from an estranged cousin, your character proceeds to make random, increasingly erratic trades.
      <br />
      <br />Will your character beat the market and find their riches? Or will you fall into crypto bankruptcy like so many before you?
      <br />
      <br />To ensure randomness, each rounds randomisation algorithm is seeded with the punchline of a random joke returned by
      <a
        href="https://official-joke-api.appspot.com/random_joke"
      >this API</a>. The randomisation library used can be found <a href="https://www.npmjs.com/package/seedrandom">here</a>.
      <br> <br> Trades are executed against live pricing using the current ticker price for a given pair returned by the <a href="https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#general-api-information">Binance API.</a>
      <br> <br> Your character's mental health changes as they dive into the world of crypto. The less stable they become, the more volatile their trading behaviour.
      <br /><br> This game is inspired by
      <a href="//progressquest.com">Progress Quest</a>.
    </p>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Start",
  components: {},
  data: () => {
    return {
      show_more: false
    };
  }
};
</script>

<style scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  text-align: center;
  margin: 10% 0;
  min-height: 100%;
  align-items: center;
}
.button {
  margin: 10px;
  padding: 5px;
  background-color: black;
  border-radius: 5px;
  color: white;
}
.button:hover {
  cursor: pointer;
  color: white;
  background-color: rgb(75, 165, 75);
}
.anchor {
  text-decoration: underline;
  padding: 5px;
  border-radius: 5px;
}
.anchor:hover {
  color: white;
  background-color: black;
  cursor: pointer;
}
.about {
  text-align: left;
  max-width: 80%;
}
</style>
