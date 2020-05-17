<template>
  <div class="loading">
    <h1>loading...</h1>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Loading"
};
</script>


<style scoped>
.loading {
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
</style>


