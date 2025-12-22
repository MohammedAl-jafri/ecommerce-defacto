<script setup></script>

<template>
  <div class="checkout-box">
    <div class="checkout-box__title">Kredi / Banka Kartı</div>
    <div class="checkout-box__content">
      <div class="payment-form">
        <div class="custom-input">
          <input type="text" placeholder="0000 0000 0000 0000" class="input" />
          <label class="label">Kart Numarası</label>
        </div>

        <div class="payment-form-row">
          <div class="custom-input">
            <input type="text" placeholder="Ay / Yıl" class="input" />
            <label class="label">Son Kullanma Tarihi</label>
          </div>
          <div class="custom-input">
            <input type="text" placeholder="***" class="input" />
            <label class="label">CVV</label>
          </div>
        </div>

        <label class="checkbox-row">
          <input type="checkbox" checked class="checkbox" />
          <span style="font-size: 12px">3D Secure ile ödemek istiyorum.</span>
        </label>
      </div>
    </div>
  </div>
</template>
