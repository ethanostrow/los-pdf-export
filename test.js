var example = [];
for (let i = 0; i < 6; i++){
    example.push("Hello (car)");
}
example[2] = "lo (car)";
console.log(example);
for (const m of example){
    for (let n = 0; n < example.length; n++){
        if (m.toLowerCase().includes(example[n].toLowerCase())){
            example[n] = m;
        }
    }
}
console.log(example);