import {

  useEffect,

  useState

} from "react";

import {

  useNavigate

} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../services/api";


function Notifications() {

  const [

    notifications,

    setNotifications

  ] = useState([]);


  const [

    user,

    setUser

  ] = useState({});


  const navigate = useNavigate();


  useEffect(()=>{

    fetchUser();

    fetchNotifications();

  },[]);


  useEffect(()=>{

    if(

      !user?.id

    ) return;


    const socket = new WebSocket(

      `ws://127.0.0.1:8000/ws/notifications/${user.id}`

    );


    socket.onopen=()=>{

      console.log(

        "WebSocket Connected"

      );

    };


    socket.onmessage=(

      event

    )=>{

      const data=

      JSON.parse(

        event.data

      );


      toast.success(

        data.message

      );


      setNotifications(

        prev=>[

          {

            id:Date.now(),

            message:

            data.message,

            is_read:false

          },

          ...prev

        ]

      );

    };


    socket.onerror=()=>{

      console.log(

        "WebSocket Error"

      );

    };


    // 🔥 KEEP SOCKET ALIVE

    const ping = setInterval(()=>{

      if(

        socket.readyState===1

      ){

        socket.send(

          "ping"

        );

      }

    },30000);


    return ()=>{

      clearInterval(

        ping

      );

      socket.close();

    };

  },[user]);


  const fetchUser=async()=>{

    try{

      const res=

      await API.get(

        "/auth/me"

      );

      setUser(

        res.data||{}

      );

    }

    catch{

      toast.error(

        "Failed user load"

      );

    }

  };


  const fetchNotifications=async()=>{

    try{

      const res=

      await API.get(

        "/notifications/"

      );

      setNotifications(

        res.data||[]

      );

    }

    catch{

      toast.error(

        "Failed notifications"

      );

    }

  };


  const markAsRead=

  async(id)=>{

    try{

      await API.patch(

      `/notifications/${id}/read`

      );

      setNotifications(

      prev=>

      prev.map(

      item=>

      item.id===id

      ?{

      ...item,

      is_read:true

      }

      :item

      )

      );

    }

    catch{

      toast.error(

      "Update failed"

      );

    }

  };


  return(

  <div style={styles.container}>


  <div style={styles.topBar}>


  <div>

  <h2 style={styles.userName}>

  👋 {

  user?.name||

  "User"

  }

  </h2>

  </div>


  <button

  style={styles.backBtn}

  onClick={()=>

  navigate(

  "/dashboard"

  )}

  >

  Dashboard

  </button>


  </div>


  <h1 style={styles.title}>

  🔔 Notifications

  </h1>


  <div style={styles.grid}>


  {

  notifications.length===0

  ?(

  <div style={styles.empty}>

  No Notifications

  </div>

  )

  :(

  notifications.map(

  item=>(

  <div

  key={item.id}

  style={styles.card}

  >

  <h3>

  {

  item.message

  }

  </h3>

  <p>

  {

  item.is_read

  ?"Read"

  :"Unread"

  }

  </p>


  {

  !item.is_read&&(

  <button

  style={styles.button}

  onClick={()=>

  markAsRead(

  item.id

  )}

  >

  Mark Read

  </button>

  )

  }


  </div>

  ))

  )

  }


  </div>

  </div>

  );

}


const styles={

container:{
minHeight:"100vh",
padding:"30px",
background:"#0f172a"
},

topBar:{
display:"flex",
justifyContent:"space-between"
},

userName:{
color:"#fff"
},

backBtn:{
padding:"10px"
},

title:{
color:"#fff"
},

grid:{
display:"grid",
gap:"20px"
},

card:{
padding:"20px",
background:"#1e293b",
color:"#fff"
},

button:{
padding:"8px"
},

empty:{
color:"#fff"
}

};


export default Notifications;