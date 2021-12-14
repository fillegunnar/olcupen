<?php 
    require "inc/header.php";
    include "inc/vars.php";
?>

<html>
    <body>
        <div class="grid-split">
            <div><img src="img/ol.gif" alt="" ></div>
            <div class="dynamic-height">
                <h1><?php echo $name ?></h1>
                <h2>
                    <?php echo $date ?> <br><br>
                    <?php echo $adress ?> <br>
                </h2>
                <!-- <a href="sign-up.php"> -->
                    <button type="button">Anmäl lag</button>
                <!-- </a> -->
            </div>
            <div id="app">
                <script src="main.js"></script>
            </div>
        </div>

    </body>
</html>