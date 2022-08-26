const download = require("download");

//session 1
var s1 = [];
for (let i = 1; i <= 12; i++){
    s1.push("https://legal.un.org/diplomaticconferences/1973_los/docs/english/vol_1/a_conf62_sr" + i +".pdf");
}

(async () => {
    await Promise.all(
      s1.map((url) => download(url, "docs/session-1"))
    );
  })();


//session 2
var s2 = [];
for (let i = 13; i <= 51; i++){
    s2.push("https://legal.un.org/diplomaticconferences/1973_los/docs/english/vol_1/a_conf62_sr" + i +".pdf");
}

(async () => {
    await Promise.all(
      s2.map((url) => download(url, "docs/session-2"))
    );
  })();


//session 3
var s3 = [];
for (let i = 52; i <= 56; i++){
    s3.push("https://legal.un.org/diplomaticconferences/1973_los/docs/english/vol_4/a_conf62_sr" + i +".pdf");
}

(async () => {
    await Promise.all(
      s3.map((url) => download(url, "docs/session-3"))
    );
  })();

//session 4
var s4 = [];
for (let i = 57; i <= 70; i++){
    s4.push("https://legal.un.org/diplomaticconferences/1973_los/docs/english/vol_5/a_conf62_sr" + i +".pdf");
}

(async () => {
    await Promise.all(
      s4.map((url) => download(url, "docs/session-4"))
    );
  })();

//session 5
var s5 = [];
for (let i = 71; i <= 76; i++){
    s5.push("https://legal.un.org/diplomaticconferences/1973_los/docs/english/vol_6/a_conf62_sr" + i +".pdf");
}

(async () => {
    await Promise.all(
      s5.map((url) => download(url, "docs/session-5"))
    );
  })();

//session 6
var s6 = [];
for (let i = 77; i <= 81; i++){
    s6.push("https://legal.un.org/diplomaticconferences/1973_los/docs/english/vol_7/a_conf62_sr" + i +".pdf");
}

(async () => {
    await Promise.all(
      s6.map((url) => download(url, "docs/session-6"))
    );
  })();

//session 7
var s7 = [];
for (let i = 82; i <= 109; i++){
    s7.push("https://legal.un.org/diplomaticconferences/1973_los/docs/english/vol_9/a_conf62_sr" + i +".pdf");
}

(async () => {
    await Promise.all(
      s7.map((url) => download(url, "docs/session-7"))
    );
  })();

//session 8
var s8 = [];
for (let i = 110; i <= 116; i++){
    s8.push("https://legal.un.org/diplomaticconferences/1973_los/docs/english/vol_11/a_conf62_sr" + i +".pdf");
}

(async () => {
    await Promise.all(
      s8.map((url) => download(url, "docs/session-8"))
    );
  })();

//session 9
var s9 = [];
for (let i = 121; i <= 129; i++){
    s9.push("https://legal.un.org/diplomaticconferences/1973_los/docs/english/vol_13/a_conf62_sr" + i +".pdf");
}

(async () => {
    await Promise.all(
      s9.map((url) => download(url, "docs/session-9"))
    );
  })();

//session 10
var s10 = [];
for (let i = 142; i <= 155; i++){
    s10.push("https://legal.un.org/diplomaticconferences/1973_los/docs/english/vol_15/a_conf62_sr" + i +".pdf");
}

(async () => {
    await Promise.all(
      s10.map((url) => download(url, "docs/session-10"))
    );
  })();

//session 11
var s11 = [];
for (let i = 156; i <= 182; i++){
    s11.push("https://legal.un.org/diplomaticconferences/1973_los/docs/english/vol_16/a_conf62_sr" + i +".pdf");
}

(async () => {
    await Promise.all(
      s11.map((url) => download(url, "docs/session-11"))
    );
  })();