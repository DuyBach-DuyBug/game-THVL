let components = {};
components.log = `      <div class="container">
<div class="form-container sign-up-container">
  <form id="registerForm">
      <h1>Create Account</h1>
      <span>Use your email for registration</span>
      <input name="name" type="text" placeholder="Name" />
      <div class="message-error" id="name-error"></div>
      <input name="email" type="email" placeholder="Email" />
      <div class="message-error" id="email-error"></div>
      <input name="password" type="password" placeholder="Password" />
      <div class="message-error" id="password-error"></div>
      <input name="passwordConfirmation" type="password" placeholder="Password" />
      <div class="message-error" id="password-confirmation-error"></div>
      <button id="registerBtn">Sign Up</button>
      <div class="message" id="signUp_message"></div>
  </form>
</div>
<div class="form-container sign-in-container">
  <form id="loginForm">
      <h1>Sign in</h1>
      <span>Use your account</span>
      <input name="email" type="email" placeholder="Email" />
      <div class="message-error" id="email-error"></div>
      <input name="password" type="password" placeholder="Password" />
      <div class="message-error" id="password-error"></div>
      <a href="#">Forgot your password?</a>
      <button id="loginBtn">Sign In</button>
  </form>
</div>
<div class="overlay-container">
  <div class="overlay">
      <div class="overlay-panel overlay-left">
          <h1>Welcome Back!</h1>
          <p>To keep connected with us please login with your personal info</p>
          <button class="ghost" id="signIn">Sign In</button>
      </div>
      <div class="overlay-panel overlay-right">
          <h1>Hello, Friend!</h1>
          <p>Enter your personal details and start journey with us</p>
          <button class="ghost" id="signUp">Sign Up</button>
      </div>
  </div>
</div>
</div>`;
components.menuGame = `<div id="sidenav" class="sidenav d-flex-col d-flex flex-spacebetween">
<form id="user-update" class="d-flex-col d-flex">
  <div class="change-img round-box">
    <input name="image" id="user-avatar" type="file" class="round-box" />
    <img src="asset/man-avatar.png" class="round-box userAvatar" />
  </div>
  <div class="row-input">
    <input name="name" id="user-name" type="text" maxlength="16" />
    <label for="user-name">Name</label>
    <span class="focus-border"><span></span></span>
    <i class="fa fa-pencil" aria-hidden="true"></i>
  </div>
  <button class="row-input">Update my detail</button>
</form>
<div class="d-flex-col d-flex">
  <div data-typeFunction="btnScore" class="btnFunction row-input btn-neon"><span></span><span></span>My score</div>
  <div data-typeFunction="btnHistory" class="btnFunction row-input btn-neon"><span></span><span></span>History</div>
  <div data-typeFunction="btnFriends" class="btnFunction row-input btn-neon"><span></span><span></span>Friends</div>
</div>
<a class="row-input btn-neon" id="btnLogout"><span></span><span></span>Logout</a>
<a id="exitSidenav" class="close-btn"></a>
</div>
<header class="nav-bar d-flex">
<div class="nav-user d-flex">
  <a onclick="userDetail()" id="user-detail">
    <figure>
      <img src="asset/man-avatar.png" class="round-box small-img userAvatar" />
    </figure>
    <p>Hello <span id="display-name"></span></p>
  </a>
</div>
<div class="d-flex flex-center">
  <h2>Solo game</h2>
</div>
<div class="d-flex flex-end">
  <h3 id="location-time"></h3>
</div>
</header>
<div onclick="outNavbar(this)" class="main d-flex">
<div class="grid-content border-solid border-curved d-flex">
  <div class="game-box border-curved col-100 d-flex">
    <div class="col-40">
      <div
        class="bg-op-50 game-img"
        style="
          background-image: url(asset/0876479dd728a4555ef519eb5d346419.png);
        "
      ></div>
    </div>
    <div class="col-60">
      <h4>XO</h4>
      <p>
        What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
        printing and typesetting industry. Lorem Ipsum has been the
        industry's standard dummy text ever since the 1500s, when an
        unknown printer took a galley of type and scrambled it to make a
        type specimen book. It has survived not only five centuries, but
        also the leap into electronic typesetting, remaining essentially
        unchanged. It was popularised in the 1960s with the release of
        Letraset sheets containing Lorem Ipsum passages, and more
        recently with desktop publishing software like Aldus PageMaker
        including versions of Lorem Ipsum.
      </p>
      <button>Play</button>
    </div>
  </div>
  <div class="game-box border-curved col-100 d-flex">
    <div class="col-40">
      <div
        class="bg-op-50 game-img"
        style="background-image: url(asset/unnamed.jpg);"
      ></div>
    </div>
    <div class="col-60">
      <h4>Battleshit board</h4>
      <p>
        Why do we use it? It is a long established fact that a reader
        will be distracted by the readable content of a page when
        looking at its layout. The point of using Lorem Ipsum is that it
        has a more-or-less normal distribution of letters, as opposed to
        using 'Content here, content here', making it look like readable
        English. Many desktop publishing packages and web page editors
        now use Lorem Ipsum as their default model text, and a search
        for 'lorem ipsum' will uncover many web sites still in their
        infancy. Various versions have evolved over the years, sometimes
        by accident, sometimes on purpose (injected humour and the
        like). English. Many desktop publishing packages and web page
        editors now use Lorem Ipsum as their default model text, and a
        search for 'lorem ipsum' will uncover many web sites still in
        their infancy. Various versions have evolved over the years,
        sometimes by accident, sometimes on purpose (injected humour and
        the like).
      </p>
      <button>Play</button>
    </div>
  </div>
</div>
<div class="right-content col-20 d-flex d-flex-col">
  <div class="score-table border-curved border-solid">
    <div class="tab d-flex">
      <button class="active" onclick="openTab(this, 'tabXo')">
        XO
      </button>
      <button onclick="openTab(this, 'tabShip')">Ship</button>
    </div>
    <div id="tabXo" class="tabcontent active">
    <div id="scoreboard_xo"></div>
    <div id="myScoreboard_xo"></div>    
    </div>
    <div id="tabShip" class="tabcontent">
    <div id="scoreboard_ship"></div>
    <div id="myScoreboard_ship"></div>
  </div>
  </div>
  <div id="friends" class="border-curved border-solid">
    <h3>Online <span id="count-online">4</span></h3>
    <div id="list-online" class="block-friends">
    </div>
  </div>
</div>
</div>
<div id="modal" class="modal border-curved border-solid"></div>`;
components.gameShip = ``;
let modal = {};
modal.btnFriends = `<div id="friend_section">
<h2>Your friends</h2>
<form id="send-request" class="d-flex">
  <input
    name="email"
    type="email"
    placeholder="Enter your friend email"
  />
  <button>Add</button>
</form>
<p id="error-friendRe" class="error-message" style="opacity:0;"></p>
<div class="container-friend">
  <h4>Friend requests</h4>
  <div id="friend-request" class="d-flex border-solid border-curved">
  </div>
  <h4>Your friends</h4>
  <div id="my-friend" class="d-flex border-solid border-curved">
    <div class="d-flex flex-spacebetween border-solid border-curved">
      <img class="round-box small-img" src="asset/woman-avatar.png" />
      <p>asdasd</p>
      <span class="status round-box online"></span>
    </div>
  </div>
</div>
</div>`;
modal.score = ``;
