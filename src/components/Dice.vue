<template>
    <div class="dice">
        <div class="input-bar">
            <input type="text"
                   :warning="!dice"
                   placeholder="骰子表达式，如：1d100"
                   v-model="expr"
            />
            <button :disabled="!dice"
                    @click="roll"
            >Roll</button>
            <transition
                    enter-active-class="animate__animated animate__fadeIn animate__fast"
                    leave-active-class="animate__animated animate__fadeOut animate__faster"
            >
                <i v-show="showRemoveButton"
                   @click="removeThis"
                   class="round-icon warning side-icon"
                >×</i>
            </transition>
        </div>
        <div class="output-bar">
            <transition-group
                    tag="div"
                    class="history"
                    mode="out-in"
                    enter-active-class="animate__animated animate__fadeInLeft animate__fast"
                    leave-active-class="animate__animated animate__fadeOut animate__fast history-leave-active"
                    move-class="v-move"
            >
                <div v-for="item of history"
                     :key="item.time"
                     class="item"
                >{{ item.result }}</div>
            </transition-group>
            <div v-if="!history.length" :key="null" class="item" style="visibility: hidden">holder</div>
        </div>

    </div>
</template>

<script>
    import 'animate.css';
    import {tryParseDice} from "@/dice";

    const MAX_HISTORY_ITEM_COUNT = 20;
    let lastTime = 0;

    export default {
        name: "Dice",
        props: {
            diceItem: {
                type: Object,
                required: true,
            },
            showRemoveButton: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                dice: null,
                pressStartTime: null,
            };
        },
        computed: {
            expr: {
                get() {
                    return this.diceItem.expr;
                },
                set(expr) {
                    this.diceItem.expr = expr;
                    this.dice = tryParseDice(expr);
                    if (this.dice) {
                        this.$emit('save');
                    }
                },
            },
            history() {
                return this.diceItem.history;
            },
        },
        methods: {
            roll() {
                if (this.dice) {
                    let time = Date.now();
                    if (time <= lastTime) {
                        time = ++lastTime;
                    }
                    this.history.unshift({
                        expr: this.expr,
                        result: this.dice(),
                        time: time,
                    });
                    if (this.history.length > MAX_HISTORY_ITEM_COUNT) {
                        this.history.splice(MAX_HISTORY_ITEM_COUNT, this.history.length - MAX_HISTORY_ITEM_COUNT);
                    }
                    this.$emit('save');
                }
            },
            removeThis() {
                this.$emit('remove', this.diceItem.time);
            },
        },
        mounted() {
            this.dice = tryParseDice(this.diceItem.expr);
        }
    }
</script>

<style scoped>

    .input-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    input[type=text] {
        min-width: 5em;
        flex: 1;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: none;
    }
    button {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border: .1em solid #2c3e50;
        border-left: none;
    }
    button:active {
        background-color: grey;
    }
    input[type=text][warning] {
        border-color: #cc5252;
    }
    button:disabled {
        background-color: #cc5252;
        border-color: #cc5252;
    }
    .warning {
        border-color: #cc5252;
        color: #cc5252;
        background-color: white;
    }

    .output-bar {
        margin: 1em 1em 0 1em;
        box-sizing: border-box;
        overflow-y: hidden;
    }

    .history {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        border-left: .1em solid cadetblue;
    }
    .item:nth-child(1),
    .item:nth-child(2),
    .item:nth-child(3),
    .item:nth-child(4)
    {
        display: inline;
    }
    .item:nth-child(1) {
        filter: opacity(1);
        background-color: cadetblue;
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }
    .item:nth-child(2) {
        filter: opacity(.75);
    }
    .item:nth-child(3), .history-leave-active {
        filter: opacity(.5);
    }

    .item {
        display: inline;
        margin-right: .5em;
        padding: .2em;
        font-size: 1.2rem;
        border-radius: .2em;
        font-family: Consolas, sans-serif;
        background-color: grey;
        filter: opacity(.5);
        color: white;
    }

    .history-absolute {
        position: absolute;
    }
</style>