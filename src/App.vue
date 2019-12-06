<template>
  <div id="app">
    <router-view />
    <Button type="primary">Primary</Button>
  </div>
</template>
<script>
import { Button, Table } from "view-design";
export default {};
</script>

<style lang="stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
