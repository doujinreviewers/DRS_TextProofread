<template>
  <div>
    <div class="sticky bg-white top-0 z-50">
      <div class="max-w-full mx-auto">
        <div class="flex flex-col justify-center items-center border-b-2 border-gray-300 py-2">
          <label class="inline-flex items-center w-7/12" :class="{'cursor-not-allowed': disable}">
            <input type="radio" class="text-indigo-600" name="mode" value="0" checked v-model="mode" :disabled="disable">
            <span class="">精密（校正サーバーにツクールのテキストデータを送ります ※要ネット環境）</span>
          </label>
          <label class="inline-flex items-center w-7/12" :class="{'cursor-not-allowed': disable}">
            <input type="radio" class="text-indigo-600" name="mode" value="1" v-model="mode" :disabled="disable">
            <span class="">簡易（プラグイン上でチェック）</span>
          </label>
        </div>
        <div class="flex justify-center items-center border-b-2 border-gray-300 py-2">
          <div class="flex flex-col justify-evenly items-start py-1 mr-8">
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" v-model="allcheck" :disabled="disable">全てチェックする</label>
          </div>
          <div class="flex flex-col justify-evenly items-start py-1">
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="CommonEvents.json" v-model="targets" :disabled="disable">コモンイベント<span v-show="targets.includes('CommonEvents.json') && (disable||finish||error)">|{{progress.CommonEvents}}%</span></label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Weapons.json" v-model="targets" :disabled="disable">武器<span v-show="targets.includes('Weapons.json') && (disable||finish||error)">|{{progress.Weapons}}%</span></label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Enemies.json" v-model="targets" :disabled="disable">敵キャラ<span v-show="targets.includes('Enemies.json') && (disable||finish||error)">|{{progress.Enemies}}%</span></label>
          </div>
          <div class="flex flex-col justify-evenly items-start py-1 pl-2">
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="MapInfos.json" v-model="targets" :disabled="disable">マップ<span v-show="targets.includes('MapInfos.json') && (disable||finish||error)">|{{progress.MapInfos}}%</span></label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Armors.json" v-model="targets" :disabled="disable">防具<span v-show="targets.includes('Armors.json') && (disable||finish||error)">|{{progress.Armors}}%</span></label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Troops.json" v-model="targets" :disabled="disable">敵グループ<span v-show="targets.includes('Troops.json') && (disable||finish||error)">|{{progress.Troops}}%</span></label>
          </div>
          <div class="flex flex-col justify-evenly items-start py-1 px-2">
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Items.json" v-model="targets" :disabled="disable">アイテム<span v-show="targets.includes('Items.json') && (disable||finish||error)">|{{progress.Items}}%</span></label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Classes.json" v-model="targets" :disabled="disable">職業<span v-show="targets.includes('Classes.json') && (disable||finish||error)">|{{progress.Classes}}%</span></label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="States.json" v-model="targets" :disabled="disable">ステート<span v-show="targets.includes('States.json') && (disable||finish||error)">|{{progress.States}}%</span></label>
          </div>
          <div class="flex flex-col justify-evenly items-start py-1">
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Actors.json" v-model="targets" :disabled="disable">アクター<span v-show="targets.includes('Actors.json') && (disable||finish||error)">|{{progress.Actors}}%</span></label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Skills.json" v-model="targets" :disabled="disable">スキル<span v-show="targets.includes('Skills.json') && (disable||finish||error)">|{{progress.Skills}}%</span></label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="System.json" v-model="targets" :disabled="disable">システム<span v-show="targets.includes('System.json') && (disable||finish||error)">|{{progress.System}}%</span></label>
          </div>
        </div>
        <div class="flex justify-center items-center border-b-2 border-gray-300 py-2">
          <button @click="execute()" :disabled="disable" :class="{'cursor-not-allowed': disable}" type="button" class="inline-flex items-center px-12 py-2 mx-3 rounded-full text-white bg-indigo-600 hover:bg-indigo-800">
            <svg v-show="disable" class="animate-spin -ml-5 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            チェックする
          </button>
          <button @click="stop()" type="button" class="inline-flex items-center px-12 py-2 mx-3 rounded-full text-white bg-stone-600 hover:bg-stone-800">
            停止
          </button>
        </div>
        <div v-if="finish" class="flex justify-center items-center py-2">
          <div class="bg-blue-100 rounded-lg py-2 px-6 text-base text-blue-700" role="alert">
            完了しました
          </div>
        </div>
        <div v-if="error" class="flex justify-center items-center py-2">
          <div class="bg-red-100 rounded-lg py-2 px-6 text-base text-red-700" role="alert">
            {{error}}
          </div>
        </div>
      </div>
    </div>

    <table class="table-fixed w-full max-w-7xl mx-auto mt-6 border-collapse border border-neutral-500">
      <thead>
        <tr class="bg-indigo-100">
          <th class="border border-neutral-500">出現箇所</th>
          <th class="border border-neutral-500">テキスト</th>
          <th class="border border-neutral-500">校正案</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in results">
          <td class="border border-neutral-500 whitespace-pre-wrap break-words">{{result.location}}</td>
          <td class="border border-neutral-500 whitespace-pre-wrap break-words" v-html="result.text"></td>
          <td class="border border-neutral-500 whitespace-pre-wrap break-words" v-html="result.suggestion"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import textlintWorker from "./assets/textlint-worker.prebundleapp";
import { Engine, formatResult } from "./lib/engine";

export default {
  name: "App",
  data() {
    return {
      results: [],
      connection: null,
      targets: [],
      allcheck: false,
      mode: "0",
      lint_result: {},
      worker: null,
      engine: null,
      current_data: {},
      run: false,
      disable: false,
      finish: false,
      error: "",
      progress: {},
    }
  },
  watch: {
    lint_result: function (newVal, oldVal) {
      if(Object.keys(newVal).length == 0){
        return;
      }
      if(this.run){
        if(newVal.messages && newVal.messages.length != 0){
          this.results.push(formatResult(this.current_data.location, newVal, this.current_data.text));
        }
        this.updateProgress();
        this.current_data = this.engine.next();
        if(this.current_data == "EOF"){
          this.stop(true);
        }else{
          this.postGameText(this.current_data.text);
        }
      }
    },
    allcheck: function(newVal, oldVal){
      if(newVal){
        this.targets = [
          "CommonEvents.json","Weapons.json","Enemies.json","MapInfos.json","Armors.json","Troops.json",
          "Items.json","Classes.json","States.json","Actors.json","Skills.json","System.json"
        ];
      }else{
        this.targets = [];
      }
    }
  },
  methods: {
    postGameText: function(text){
      this.worker.postMessage({
        command: "lint",
        text: text,
        ext: ".md"
      })
    },
    execute: function () {
      if(this.targets.length == 0){
        this.error = "チェックするデータを選んでください"
        this.stop();
        return;
      }
      this.results = [];
      this.lint_result = {};
      this.disable = true;
      this.finish = false;
      this.error = "";
      this.run = true;
      this.initProgress();

      if(this.mode == "0"){
        this.connection = new WebSocket("wss://proofread.doujin-reviewers.info");

        this.connection.onerror = function(event) {
          this.error = "サーバーとの接続に失敗しました"
          this.stop();
        }.bind(this)

        this.connection.onopen = function(event) {
          this.engine = new Engine(this.targets.concat());
          this.current_data = this.engine.next();
          this.updateProgress();
          this.connection.send(JSON.stringify(this.current_data));
        }.bind(this)

        this.connection.onmessage = function(event) {
          let recieve = JSON.parse(event.data);
          if('error' in recieve){
            this.error = "サーバーとの接続に失敗しました"
            this.stop();
            return;
          }else if(!('result_ok' in recieve)){
            this.results.push(recieve);
          }
          this.current_data = this.engine.next();
          this.updateProgress();
          if(this.current_data == "EOF"){
            this.stop(true);
          }else{
            this.connection.send(JSON.stringify(this.current_data));
          }
        }.bind(this)
      }else{
        const url = URL.createObjectURL(
          new Blob([textlintWorker], { type: "text/javascript" })
        );
        this.worker = new Worker(url);
        this.worker.addEventListener('message', function (event) {
          if (event.data.command === "lint:result") {
            this.lint_result = event.data.result;
          }
        }.bind(this));
        this.engine = new Engine(this.targets.concat());
        this.current_data = this.engine.next();
        this.updateProgress();
        this.postGameText(this.current_data.text);
      }
    },
    stop: function (success) {
      this.run = false;
      this.disable = false;
      if(this.mode == "0"){
        this.connection.send('{"text":"__WS_CLOSE_REQUEST__"}');
        this.connection.close()
      }
      if(success){
        this.finish = true;
        this.error = "";
      }
    },
    updateProgress: function () {
      if(this.engine.progress.current_target == "CommonEvents.json"){
        this.progress.CommonEvents = this.engine.progress.progress;
      }else if(this.engine.progress.current_target == "Weapons.json"){
        this.progress.Weapons = this.engine.progress.progress;
      }else if(this.engine.progress.current_target == "Enemies.json"){
        this.progress.Enemies = this.engine.progress.progress;
      }else if(this.engine.progress.current_target == "MapInfos.json"){
        this.progress.MapInfos = this.engine.progress.progress;
      }else if(this.engine.progress.current_target == "Armors.json"){
        this.progress.Armors = this.engine.progress.progress;
      }else if(this.engine.progress.current_target == "Troops.json"){
        this.progress.Troops = this.engine.progress.progress;
      }else if(this.engine.progress.current_target == "Items.json"){
        this.progress.Items = this.engine.progress.progress;
      }else if(this.engine.progress.current_target == "Classes.json"){
        this.progress.Classes = this.engine.progress.progress;
      }else if(this.engine.progress.current_target == "States.json"){
        this.progress.States = this.engine.progress.progress;
      }else if(this.engine.progress.current_target == "Actors.json"){
        this.progress.Actors = this.engine.progress.progress;
      }else if(this.engine.progress.current_target == "Skills.json"){
        this.progress.Skills = this.engine.progress.progress;
      }else if(this.engine.progress.current_target == "System.json"){
        this.progress.System = this.engine.progress.progress;
      }
    },
    initProgress: function () {
      this.progress = {
        CommonEvents: 0,
        Weapons: 0,
        Enemies: 0,
        MapInfos: 0,
        Armors: 0,
        Troops: 0,
        Items: 0,
        Classes: 0,
        States: 0,
        Actors: 0,
        Skills: 0,
        System: 0,
      }
    }
  },
}
</script>