<template>
    <div>
        {{ message }}
        <span id="ttt">{{contents}}</span>
        <span id="fff">{{aaaaa}}</span>
        <span id="rrr">{{error}}</span>
        <button @click="getCurrentDirectory">btn</button>
        <button class="bg-green-500">Button</button>
    </div>
</template>

<script>
export default {
  name: "App",
  data() {
      return {
          message: "Hello Vue!",
          contents: "",
          error: "",
          aaaaa: "",
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
    }
  },
  mounted() {
    // this.getCurrentDirectory()
  },
}
</script>