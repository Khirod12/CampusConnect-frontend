import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {

  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const theme = {
    bg: dark
      ? "linear-gradient(135deg,#0f172a,#1e293b)"
      : "linear-gradient(135deg,#eef2ff,#f8fafc)",
    card: dark ? "rgba(30,41,59,0.7)" : "rgba(255,255,255,0.8)",
    text: dark ? "#f8fafc" : "#111827",
    sub: dark ? "#94a3b8" : "#6b7280",
    border: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
  };

  return (
    <div style={{
      minHeight:"100vh",
      display:"flex",
      flexDirection:"column",
      background: theme.bg,
      color: theme.text,
      transition:"0.4s"
    }}>

      {/* ================= NAVBAR ================= */}
      <div style={{
        padding:isMobile ? "15px 20px" : "18px 8%",
        display:"flex",
        flexDirection:isMobile ? "column" : "row",
        justifyContent:"space-between",
        alignItems:isMobile ? "flex-start" : "center",
        gap:isMobile ? "12px" : "0",
        background: theme.card,
        backdropFilter:"blur(12px)",
        borderBottom:`1px solid ${theme.border}`
      }}>

        <h2 style={{
          fontWeight:"700",
          fontSize:isMobile ? "20px" : "22px"
        }}>
          CampusConnect
        </h2>

        <div style={{
          display:"flex",
          gap:"10px",
          width:isMobile ? "100%" : "auto"
        }}>

          <button
            onClick={()=>setDark(!dark)}
            style={{
              flex:isMobile ? 1 : "none",
              padding:"8px 12px",
              borderRadius:"8px",
              border:"none",
              background:"#4f46e5",
              color:"white",
              cursor:"pointer"
            }}
          >
            {dark ? "☀" : "🌙"}
          </button>

          <button
            onClick={()=>navigate("/login")}
            style={{
              flex:isMobile ? 1 : "none",
              padding:"8px 18px",
              borderRadius:"8px",
              border:"1px solid #4f46e5",
              background:"transparent",
              color:"#4f46e5",
              fontWeight:"600",
              cursor:"pointer"
            }}
          >
            Login
          </button>

          <button
            onClick={()=>navigate("/register")}
            style={{
              flex:isMobile ? 1 : "none",
              padding:"8px 18px",
              borderRadius:"8px",
              border:"none",
              background:"#4f46e5",
              color:"white",
              fontWeight:"600",
              cursor:"pointer"
            }}
          >
            Register
          </button>

        </div>

      </div>

      {/* ================= HERO ================= */}
      <div style={{
        flex:1,
        display:"flex",
        flexDirection:isMobile ? "column" : "row",
        justifyContent:"space-between",
        alignItems:"center",
        padding:isMobile ? "50px 20px" : "80px 8%",
        gap:"40px",
        textAlign:isMobile ? "center" : "left"
      }}>

        <div style={{maxWidth:"600px"}}>
          <h1 style={{
            fontWeight:"800",
            marginBottom:"20px",
            fontSize:isMobile ? "30px" : "52px",
            lineHeight:"1.2"
          }}>
            Lost Something? <br/> We Help You Find It.
          </h1>

          <p style={{
            fontSize:isMobile ? "15px" : "18px",
            color: theme.sub,
            marginBottom:"30px"
          }}>
            A smart campus lost & found platform that reconnects people
            with their belongings quickly and securely.
          </p>

          <div style={{
            display:"flex",
            flexDirection:isMobile ? "column" : "row",
            gap:"15px"
          }}>
            <button
              onClick={()=>navigate("/register")}
              style={{
                padding:"14px 28px",
                borderRadius:"12px",
                border:"none",
                background:"#4f46e5",
                color:"white",
                fontWeight:"600",
                cursor:"pointer"
              }}
            >
              Get Started
            </button>

            <button
              onClick={()=>navigate("/login")}
              style={{
                padding:"14px 28px",
                borderRadius:"12px",
                border:"1px solid #4f46e5",
                background:"transparent",
                color:"#4f46e5",
                fontWeight:"600",
                cursor:"pointer"
              }}
            >
              Login
            </button>
          </div>
        </div>

        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png"
            alt=""
            style={{
              width:isMobile ? "220px" : "380px"
            }}
          />
        </div>

      </div>

      {/* ================= FEATURES ================= */}
      <div style={{
        padding:isMobile ? "50px 20px" : "80px 8%",
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
        gap:"25px"
      }}>

        {[
          {icon:"🔍",title:"Easy Reporting",desc:"Report lost or found items in seconds."},
          {icon:"⚡",title:"Instant Matching",desc:"Admin matches items quickly."},
          {icon:"🔐",title:"Secure Login",desc:"Protected dashboards for users & admin."}
        ].map((f,i)=>(
          <div key={i}
            style={{
              padding:"30px",
              borderRadius:"20px",
              background: theme.card,
              border:`1px solid ${theme.border}`,
              textAlign:"center"
            }}>
            <h3 style={{marginBottom:"10px"}}>
              {f.icon} {f.title}
            </h3>
            <p style={{color:theme.sub,fontSize:"14px"}}>
              {f.desc}
            </p>
          </div>
        ))}

      </div>

      {/* ================= FOOTER ================= */}
      <div style={{
        padding:"20px",
        textAlign:"center",
        fontSize:"14px",
        background: theme.card,
        borderTop:`1px solid ${theme.border}`
      }}>
        © {new Date().getFullYear()} CampusConnect | Built with ❤️
      </div>

    </div>
  );
}

export default Home;
