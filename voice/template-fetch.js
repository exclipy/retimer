fetch(
  "https://cxl-services.appspot.com/proxy?url=https://us-central1-texttospeech.googleapis.com/v1beta1/text:synthesize&token=03AFY_a8W7uJNScxgFGFyFSlbZ2ySqy2X8C14sgGW1MIPKErpG84n77z1t058VbIRbDJmIZe1MUXZ2STJsQnoMsjV7eIiTuBB_Z_iK4K0nAQ9sGngJfVkxj1-EQy8iVpq3YUSUXxKTgUz8I5XVDhSAEdw2rYyqEx8nlE14ZCHmLWdvUBA61fsRSczV0eeNtXhLvHPlNvBxxBRVuLLTKtiYvRTXoNrXtW9PiGejgNvPtTsF-U3EQcQo-0ig7B674liIIB59z4AI2mldfyKyUyaUbR1CsVf5Ak3OIAtulaZK9jRFMrsfEOJmEH6oWLuD4D1oEpl9emsQaLXfqJm_cstPEQyYnhX-xjf-fhw3TPd0NO_odIMiZcVAgvg5n-z5BgMT9GSsgclbZOzS0y5K2Qzg4KdzskR7_yMlntgODAirrZ_5tTZC45H05CInD5NAmL_kFHyfA6cyTqmBBbHP-2CGEw8ALzwpY8d3RIF_P1JR3UhemqtouB-SqS6pQpiNaBgFO53yH5fPr1PYNFAK_ZdPCOIFdJKQLfX12A",
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
    referrer: "https://www.gstatic.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: '{"input":{"ssml":"<speak> <emphasis level=\\"reduced\\">60 seconds</emphasis> </speak>"},"voice":{"languageCode":"en-AU","name":"en-AU-Neural2-B"},"audioConfig":{"audioEncoding":"OGG_OPUS","pitch":0,"speakingRate":0.55,"effectsProfileId":["small-bluetooth-speaker-class-device"]}}',
    method: "POST",
    mode: "cors",
    credentials: "omit",
  }
);
