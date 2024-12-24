import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

function Home() {
  const [showChristmasMessage, setShowChristmasMessage] = useState(false);
  const [showGuideInfo, setShowGuideInfo] = useState(false);
  const [snowflakes, setSnowflakes] = useState([]);
  const treeRef = useRef(null);
  const { setValue } = useForm();

  // Hiệu ứng lắc cây thông
  useEffect(() => {
    const treeIcon = treeRef.current;
    if (treeIcon) {
      const handleMouseEnter = () => {
        treeIcon.classList.add("shake-animation");
        treeIcon.addEventListener("animationend", () => {
          treeIcon.classList.remove("shake-animation");
        });
      };
      treeIcon.addEventListener("mouseenter", handleMouseEnter);
      return () => {
        treeIcon.removeEventListener("mouseenter", handleMouseEnter);
      };
    }
  }, []);

  // Tạo hiệu ứng tuyết rơi
  useEffect(() => {
    const generateSnowflakes = () => {
      const flakes = [];
      for (let i = 0; i < 50; i++) {
        const size = Math.random() * 10 + 5;
        flakes.push({
          id: i,
          size: size,
          left: `${Math.random() * 100}vw`,
          animationDuration: `${Math.random() * 2 + 3}s`,
          animationDelay: `${Math.random() * 20}s`,
        });
      }
      setSnowflakes(flakes);
    };

    generateSnowflakes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      toast("Ấn vào cây thông Noel để gửi lời chúc cho tớ nhé!!", {
        icon: "💌",
        style: {
          backgroundColor: "#a5d6a7",
          color: "red",
          textAlign: "center",
        },
      });
    }, 30000);

    return () => clearInterval(interval);
  });

  const onSubmit = async (data) => {
    try {
      await axios
        .post(`http://localhost:3000/friendWishes`, data)
        .then((response) => {
          Swal.fire({
            title: "Gửi thành công",
            text: "Cảm ơn vì đã dành chút thời gian",
            icon: "success",
            confirmButtonText: "Bye",
            confirmButtonColor: "red",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = () => {
    // Hiển thị SweetAlert2 modal với hai input
    Swal.fire({
      title: "Gửi lời chúc cho MLinh",
      confirmButtonText: "Gửi",
      confirmButtonColor: "red",
      html: `
        <form id="myForm">
          <input id="name" class="swal2-input" placeholder="Ghi rõ tên để tớ biết cậu" />
          <input id="wishes" class="swal2-input" placeholder="Lời chúc của cậu..." />
        </form>
      `,
      focusConfirm: false,
      preConfirm: () => {
        // Lấy giá trị của các input từ SweetAlert2 modal
        const name = document.getElementById("name").value;
        const wishes = document.getElementById("wishes").value;

        // Cập nhật giá trị của form qua React Hook Form
        setValue("name", name);
        setValue("wishes", wishes);

        // Kiểm tra tính hợp lệ của form trước khi tiếp tục
        if (!name || !wishes) {
          Swal.showValidationMessage("Đừng bỏ trống nhé!!!");
          return false;
        }
        return { name, wishes }; // Trả về giá trị khi form hợp lệ
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { name, wishes } = result.value;
        onSubmit({ name, wishes });
      }
    });
  };

  return (
    <div>
      <main>
        {/* Hiệu ứng tuyết rơi */}
        <div className="snowflakes">
          {snowflakes.map((flake) => (
            <div
              key={flake.id}
              className="snowflake"
              style={{
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                left: flake.left,
                animationDuration: flake.animationDuration,
                animationDelay: flake.animationDelay,
              }}
            />
          ))}
        </div>

        {/* Âm thanh Giáng Sinh */}
        <audio id="audio" src="./giangsinh.mp3" autoPlay loop />

        {/* Thông điệp Giáng Sinh */}
        {showChristmasMessage || (
          <div id="as" className="christmas-message">
            Merry Christmas
          </div>
        )}

        {/* Cây thông */}
        <div className="tree-container" onClick={handleFormSubmit}>
          <img
            ref={treeRef}
            src="https://github.com/Panbap/datapanbap/blob/main/image/big_tree.png?raw=true"
            alt="Cây thông"
            className="tree-icon"
          />
        </div>

        {/* Nút hiển thị thiệp */}
        {!showGuideInfo && (
          <div className="container">
            <button
              onClick={() => {
                setShowChristmasMessage(!showChristmasMessage);
                setShowGuideInfo(true);
              }}
              id="showButton"
            >
              Quà của MLinh
            </button>
          </div>
        )}

        {/* Thiệp hướng dẫn */}
        {showGuideInfo && (
          <div id="guideInfo" className="guide-info">
            <button
              onClick={() => {
                setShowChristmasMessage(!showChristmasMessage);
                setShowGuideInfo(false);
              }}
              id="closeButton"
              className="close-btn"
            >
              X
            </button>
            <div id="ax" className="card">
              <div className="imgBox">
                <div className="bark" />
                <img src="https://github.com/Panbap/datapanbap/blob/main/image/mery.png?raw=true" />
              </div>
              <div className="details">
                <h3 className="h3 color fw-bold">MERRY CHRISTMAS</h3>
                <p>
                  Giáng Sinh đến rồi. <br />
                  Chúc bạn mùa lễ giáng sinh ấm áp vào ngọt ngào bên gia đình và
                  những người yêu thương. Chúc bạn luôn đẹp trai, xinh gái. Chúc
                  bạn luôn giữ nụ cười tươi trên môi. Gặt hái được nhiều thành
                  công, di học thì sẽ có nhiều điểm tốt, đi làm thì sẽ nhận được
                  job ngon bạn nhé. Cảm ơn vì đã xuất hiện và đồng hành cùng tớ
                  trong 1 quãng thời gian có vui có buồn. Cảm ơn vì đã là 1 phần
                  ngắn trong cuộc đời của tớ. <br />
                  <small>P/s: Đừng quên chúc lại tôi nhé !!</small>
                </p>
                <p className="text-right">Giáng Sinh an lành!</p>
                <p className="text-right">♥From MLinh w luv♥</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
