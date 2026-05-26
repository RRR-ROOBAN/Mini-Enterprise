import {

useState

} from "react";

import API from "../services/api";


function Billing(){

const[

amount,

setAmount

]=useState(100);


const[

result,

setResult

]=useState(null);


const handlePayment=async()=>{

try{

const res=

await API.post(

`/billing/pay?amount=${amount}`

);

setResult(

res.data

);

}

catch(err){

console.log(

err

);

}

};


return(

<div style={styles.container}>


<div style={styles.card}>


<h1 style={styles.title}>

💳 SaaS Billing Center

</h1>


<p style={styles.subtitle}>

Manage enterprise payments securely

</p>


<input

type="number"

value={amount}

onChange={(e)=>

setAmount(

e.target.value

)

}

style={styles.input}

/>


<button

onClick={handlePayment}

style={styles.button}

>

Pay Now 🚀

</button>


{

result&&(

<div style={styles.result}>


<h3>

✅ Payment Created

</h3>


<p>

Stripe Client Secret

</p>


<div style={styles.secretBox}>

{

result.client_secret

}

</div>


</div>

)

}


</div>


</div>

);

}


const styles={

container:{

height:"100vh",

display:"flex",

justifyContent:"center",

alignItems:"center",

background:

"linear-gradient(135deg,#020617,#0f172a)"

},

card:{

background:

"rgba(255,255,255,0.08)",

backdropFilter:

"blur(12px)",

padding:"45px",

borderRadius:"25px",

width:"450px",

textAlign:"center",

boxShadow:

"0 8px 35px rgba(0,0,0,0.45)",

border:

"1px solid rgba(255,255,255,0.1)"

},

title:{

fontSize:"38px",

fontWeight:"800",

background:

"linear-gradient(90deg,#60a5fa,#a855f7)",

WebkitBackgroundClip:

"text",

WebkitTextFillColor:

"transparent"

},

subtitle:{

color:"#cbd5e1",

marginBottom:"25px"

},

input:{

width:"100%",

padding:"14px",

borderRadius:"14px",

border:"none",

fontSize:"16px",

marginBottom:"20px"

},

button:{

width:"100%",

padding:"14px",

background:

"linear-gradient(135deg,#2563eb,#7c3aed)",

border:"none",

borderRadius:"14px",

fontWeight:"700",

fontSize:"16px",

color:"#fff",

cursor:"pointer",

boxShadow:

"0 8px 25px rgba(99,102,241,0.35)"

},

result:{

marginTop:"25px",

padding:"20px",

borderRadius:"16px",

background:

"rgba(37,99,235,0.12)",

color:"#fff"

},

secretBox:{

marginTop:"10px",

padding:"12px",

background:"#1e293b",

borderRadius:"10px",

fontSize:"12px",

wordBreak:"break-word"

}

};


export default Billing;