<template>
  <div class="dna-border" aria-hidden="true">
    <div class="dna-side dna-left"></div>
    <div class="dna-side dna-right"></div>
    <div class="dna-horizontal dna-top"></div>
    <div class="dna-horizontal dna-bottom"></div>
  </div>
</template>

<style scoped>
.dna-side,
.dna-horizontal {
  position: absolute;
  pointer-events: none;
  opacity: 0.65;
}

.dna-side {
  top: 0;
  bottom: 0;
  width: 54px;
  background:
    radial-gradient(circle at 12px 10px, #4a6a8a 0 3px, transparent 3.5px) 0 0 / 54px 50px,
    radial-gradient(circle at 42px 35px, #6a8aaa 0 3px, transparent 3.5px) 0 0 / 54px 50px,
    repeating-linear-gradient(75deg, transparent 0 20px, #8aaacc55 21px 22px, transparent 23px 45px);
}

.dna-left {
  left: -54px;
}

.dna-right {
  right: -54px;
  transform: scaleX(-1);
}

.dna-horizontal {
  left: 0;
  right: 0;
  height: 42px;
  background:
    radial-gradient(circle at 10px 11px, #4a6a8a 0 3px, transparent 3.5px) 0 0 / 50px 42px,
    radial-gradient(circle at 35px 31px, #6a8aaa 0 3px, transparent 3.5px) 0 0 / 50px 42px,
    repeating-linear-gradient(15deg, transparent 0 20px, #8aaacc55 21px 22px, transparent 23px 45px);
}

.dna-top {
  top: -42px;
}

.dna-bottom {
  bottom: -42px;
  transform: scaleY(-1);
}

@media (max-width: 900px) {
  .dna-border {
    display: none;
  }
}
</style>
