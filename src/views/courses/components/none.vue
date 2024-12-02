<template>
  <div class="none-container">
    <i class="fas fa-box-open none-icon"></i>
    <p class="none-text">这里空空如也</p>
  </div>
</template>

<script>
export default {
  name: 'None',
};
</script>

<style scoped>
.none-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #888;
  font-family: 'Arial', sans-serif;
}

.none-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ccc;
}

.none-text {
  font-size: 16px;
}
</style>