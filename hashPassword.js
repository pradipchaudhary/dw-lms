import bcrypt from "bcrypt";

// Generate hash password
const pass = "Pradip";
// bcrypt.hash(pass, 10, (err, result) => {
//     console.log("result...");
//     console.log(result);
//     console.log("Password hash");
// });

const hashPass = await bcrypt.hash(pass, 10);
console.log(hashPass);
const isMatch = await bcrypt.compare(hashPass, "Pradip");
console.log(isMatch);

// Compare hash password and plan password
