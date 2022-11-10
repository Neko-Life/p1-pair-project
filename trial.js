let x = Math.ceil(Math.random() * 100);

console.log(x);

if (x % 60 !== 0){
    if (x % 60 < 10){
        console.log(`0${Math.floor(x/60)}:0${x%60}`);
    } else {
        console.log(`0${Math.floor(x/60)}:${x%60}`);
    }
} else {
    console.log(`0${x%60}:00`);
}