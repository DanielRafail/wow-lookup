import "../CSS/main.css";

/**
 * Error page which shows a 404 message (regardless of the error number, maybe I should throw 418 randomly idk)
 * @returns HTML and logic components for the error page
 */
const Errorpage = () => {
  return (
    <div class="main">
      <div className="body errorpage-main">
        <p>404 | NOT FOUND</p>
      </div>
    </div>
  );
};

export default Errorpage;
