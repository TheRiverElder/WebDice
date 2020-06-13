<template>
  <div id="app">
    <div class="top-bar">
      <i class="icon side-icon" @click="showRemoveButton = !showRemoveButton">-</i>
      <span class="title">黄黄的法苏荼尔菌</span>
      <i class="icon side-icon" @click="newDiceItem">+</i>
    </div>
    <transition-group
            tag="div"
            class="dice-list"
            enter-active-class="animate__animated animate__fadeInLeft animate__fast"
            leave-active-class="animate__animated animate__fadeOutRight animate__fast"
            move-class="v-move"
    >
      <Dice v-for="diceItem of diceList"
            :key="diceItem.time"
            :dice-item="diceItem"
            :show-remove-button="showRemoveButton"
            class="dice-item"
            @remove="removeDice"
            @save="save"
      />
    </transition-group>
  </div>
</template>

<script>

  import 'animate.css';
  import Dice from './components/Dice.vue';
  import {loadDiceList, saveDiceList} from "@/save";

  export default {
    name: 'App',
    components: {
      Dice,
    },
    data() {
      return {
        diceList: [],
        showRemoveButton: false,
      };
    },
    methods: {
      newDiceItem() {
        this.diceList.unshift({expr: '1d100', history: [], time: Date.now()});
        this.save();
      },
      removeDice(time) {
        const index = this.diceList.findIndex(d => d.time === time);
        if (index >= 0) {
          this.diceList.splice(index, 1);
          this.save();
        }
      },
      save() {
        saveDiceList(this.diceList);
      },
    },
    created() {
      this.diceList = loadDiceList();
    },
    beforeDestroy() {
      saveDiceList(this.diceList);
    }
  }
</script>

<style>

  html, body, #app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  button, input[type=text] {
    height: 2em;
    padding: 0 1.5em;
    font-size: 1.2rem;
    font-family: Consolas, Helvetica, Arial, sans-serif;
    outline: none;
    border: none;
    border-radius: 1em;
    box-sizing: border-box;
  }

  button {
    background-color: #2c3e50;
    color: white;
  }

  input[type=text] {
    border: .1em solid #2c3e50;
    background-color: white;
    color: #2c3e50;
  }

  .icon {
    font-size: 2rem;
    color: #2c3e50;
    user-select: none;
  }
  .side-icon {
    margin: 0 .5em;
  }
  .round-icon {
    width: 1.5rem;
    height: 1.5rem;
    font-style: normal;
    font-size: 1.5rem;
    user-select: none;
    border: .1em solid #2c3e50;
    border-radius: 2em;
  }

  .v-move {
    transition: all 500ms;
  }
</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<style scoped>
  #app {
    display: flex;
    flex-direction: column;
  }
  .top-bar {
    width: 100%;
    padding: .5rem;
    box-sizing: border-box;
    box-shadow: 0 .1em .5em #bfbfbf;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .title {
    flex: 1;
    font-size: 1.5rem;
    font-family: 方正姚体, 黑体;
    color: #2c3e50;
  }
  .dice-list {
    width: 100%;
    flex: 1;
    padding: 0 1em;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .dice-item {
    padding: 1em 0;
    border-bottom: .05em solid #bfbfbf;
  }
  .dice-item:last-child {
    margin-bottom: 50vh;
  }
</style>
