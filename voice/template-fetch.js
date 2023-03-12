fetch(
  "https://cxl-services.appspot.com/proxy?url=https://us-central1-texttospeech.googleapis.com/v1beta1/text:synthesize&token=03AFY_a8USJsc5QV2UhxszpSBOocjc-vKQpk3d3PvP4nGk1gnqNuCaofvdREevcXNf4PzZJ8XK_j00G1rDK3xehOwIF1_eaAiB0FtR2rtVmQBWAuQSRre_-z836ZnHpED7_OnwqPxrPhq8Nk7pkq7ZH6cr9kXGnqrL3czr5eYHraEvorJlG_dFGPmAEUj1CP52HDeAO-hN6RI6gUw2McmmI2x_GKk3vv1psKDQTRqQtcDEYg4PwHwu32SHeHCUUB013MqNZQC1VsU8f5xpvc9bYIS-zRLuZJ-X_Eu2dQZyVTGItDdSOXfj-xqqJco09YrABcgI3STZkD5H8Z3V6IAyksd-gm5-EHZ5L-JoWXLcHYQl0RVc2PlPmkHPY1cA652gpn5hT9LNDak6D4IbPPPt2-1flTD9a_rouLyrgV8bJwTgEVWv62Dov_jO7g-qpu4BKkCRrG8AEcEbhyUXLPljszeMyRmBmjnHvGw0dMOxh47OT7yFO-UHRUhZC_43toD7vYQdd66tnJ2TrVHTLQi7ih_ZT6AQSQPJuQ",
  {
    headers: {
      accept: "*/*",
      "accept-language": "en-GB,en;q=0.9",
      "content-type": "text/plain;charset=UTF-8",
      "sec-ch-ua": '"Chromium";v="110", "Not A(Brand";v="24", "Brave";v="110"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "sec-gpc": "1",
    },
    referrer: "https://cloud.google.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: '{"input":{"ssml":"<speak> <emphasis level=\\"reduced\\">Breathe</emphasis> </speak>"},"voice":{"languageCode":"en-AU","name":"en-AU-Neural2-B"},"audioConfig":{"audioEncoding":"OGG_OPUS","pitch":0,"speakingRate":0.55,"effectsProfileId":["small-bluetooth-speaker-class-device"]}}',
    method: "POST",
    mode: "cors",
    credentials: "omit",
  }
);
