document.querySelectorAll(".thumb2").forEach((button) => {
  button.addEventListener("click", async (event) => {
      console.log("hhiiii", button.getAttribute("id"));

      let id = button.getAttribute("id");
      if (!id) return;

      event.preventDefault(); 

      try {
          let response = await fetch(`/likepost/${id}`, { method: "GET" });
          let result = await response.json(); // Assuming the server returns JSON

          if (result === true) {
              socket.emit("likedpost", id);
              console.log("Message liked successfully--:", result);
             
          }
      } catch (error) {
          console.error("Error message:", error);
      }
  });
});

         
