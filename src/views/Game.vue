<template>
  <div class>
    <div class="loading" v-if="!this.$store.state.ready">
      <Loading />
    </div>
    <div class="ready" v-else>
      <div class="game-info">
        <p>Game start: <br> {{this.$store.state.game_start_time}}</p>
        <p>Initial funds: <br> ${{this.$store.state.initial_funds}}</p>
        <p>Random seed: <br> "{{this.$store.state.random_seed}}"</p>
      </div>
      <div class="main-screen">
        <div class="narrative-block">
          <ul>
            <li v-for="event in events" :key="event.index" :class="event.type">
              <p class="event-time">{{event.time}}</p>
              <p class="event-string">{{event.event}}</p>
            </li>
          </ul>
        </div>
        <div class="accounts">
          <p class="bank">Bank Account: ${{this.$store.getters.roundedBankAccount}}</p>
          <div class="portfolio">
            <h3>Portfolio</h3>
            <ul>
              <li v-for="value in current_funds" :key="value.index" class="portfolio-list">
                <span class="list-item">{{value.symbol}}</span>
                <span class="list-item">{{value.amt.toFixed(4)}}</span>
              </li>
            </ul>
          </div>
          <div class="attributes">
            <h3>Attributes</h3>
            <p>Mental Health: {{mental_health}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";
import Loading from "../components/Loading.vue";

export default {
  name: "Home",
  components: {
    Loading
  },
  data: () => {
    return {};
  },
  computed: {
    ...mapState(["events", "current_funds", "mental_health"])
  },
  mounted() {
    this.$store.dispatch("initialise");
  }
};
</script>

<style scoped>
.ready {
  display: flex;
  flex-direction: column;
  text-align: center;
}
.main-screen {
  display: flex;
  justify-content: space-between;
  margin: 10px;
}
.game-info {
  color: white;
  background-color: black;
  padding: 5px;
  display: flex;
  justify-content: space-evenly;
  border-radius: 5px;
}
.narrative-block {
  padding: 5px;
  margin-right: 5px;
  width: 60%;
  text-align: left;
}
ul {
  list-style: none;
}
.event {
  display: flex;
}
.event-time {
  margin: 5px;
  padding: 5px;
  width: 30%;
}
.event-string {
  margin: 5px;
  padding: 5px;
  width: 70%;
}
.accounts {
  text-align: left;
  padding: 5px;
  width: 40%;
  height: 100%;
  position: sticky;
  top: 5;
  align-self: flex-start;
  text-overflow: ellipsis;
  
}
.portfolio-list {
  display: flex;
  padding: 5px;
  width: 100%;
  text-overflow: ellipsis;
  
}
.list-item {
  text-align: left;
  padding: 3px;
  text-overflow: ellipsis;
}
.attributes {
  background-color: whitesmoke;
  padding: 5px;
  border-radius: 5px;
  margin: 5px;
}
.portfolio {
  background-color: azure;
  padding: 5px;
  border-radius: 5px;
  margin: 5px;
  text-overflow: ellipsis;
}
.trade {
  display: flex;
  color: white;
  background-color: indianred;
  margin: 5px;
  border-radius: 5px;
}
.narrative {
  display: flex;
  color: black;
  background-color: white;
  margin: 5px;
  border-radius: 5px;
}
.bank {
  background-color: aquamarine;
  padding: 5px;
  border-radius: 5px;
  margin: 5px;
  margin-top: 20px;
}
</style>
