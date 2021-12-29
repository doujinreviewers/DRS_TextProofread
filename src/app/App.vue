<template>
  <div>
    <div class="sticky bg-white top-0 z-50">
      <div class="max-w-full mx-auto">
        <div class="flex justify-center items-center border-b-2 border-gray-300 py-2">
          <label class="inline-flex items-center mx-2">
            <input type="radio" class="text-indigo-600" name="mode" value="0" checked>
            <span class="">精密（校正サーバーにツクールのテキストデータを送ります ※要ネット環境）</span>
          </label>
          <label class="inline-flex items-center mx-2">
            <input type="radio" class="text-indigo-600" name="mode" value="1">
            <span class="">簡易（プラグイン上でチェック）</span>
          </label>
        </div>
        <div class="flex justify-center items-center border-b-2 border-gray-300 py-2">
          <button type="button" class="inline-flex items-center px-12 py-2 rounded-full text-white bg-indigo-600 hover:bg-indigo-800">
            チェックする
          </button>
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
        <tr>
          <td class="border border-neutral-500">Indiana</td>
          <td class="border border-neutral-500">Indianapolis</td>
          <td class="border border-neutral-500">Indianapolis</td>
        </tr>
        <tr>
          <td class="border border-neutral-500">Ohio</td>
          <td class="border border-neutral-500">Columbus</td>
          <td class="border border-neutral-500">Indianapolis</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
      return {
          message: "Hello Vue!",
      }
  },
  methods: {
    getCurrentDirectory: function () {
      // process.version
      const fs = nw.require('fs');
      try {
        this.contents = fs.readdirSync('.');
        // console.info(fs.readdirSync(process.cwd()))
        this.aaaaa = process.cwd()
        this.error = false;
      } catch (err) {
        this.error = true;
      }
    },
    execute: function () {
      let connection = new WebSocket("ws://192.168.0.16:8080")
        connection.onmessage = function(event) {
      }

      connection.onopen = function(event) {
        connection.send("token send");
      }
    }
  },
  mounted() {
    this.execute()
  },
}
</script>