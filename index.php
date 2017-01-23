<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Login</title>
        <!--Linken stylesheet-->
        <link rel="stylesheet" type="text/css" href="CSS/Style.css">
        <!--Linken has favicon-->
        <link rel="shortcut icon" type="image/x-icon" href="Images/has_favicon.ico">
        <link rel="icon" href="Images/has_favicon.ico" type="image/x-icon">
    </head>
    <body>
        <div id="header">
            <img src="Images/has_logo.png" alt="HAS logo">
            <h1>Invoer applicatie HAS actuele internationale mobiliteit</h1>
        </div>
        <?php
    session_start();
    if(isset($_SESSION['username']) && isset($_SESSION['ww']))
    {
        die("U bent al aangemeld<input type=\"button\" value=\"Ga terug naar invoer\" onclick=\"window.location.href = 'main.html'; \">");
    }
        ?>
        <div id="formLogin" class="form">
            <form method="post">
                <table class="formTable">
                    <tr>
                        <td><label for="username">Vul een username in:</label></td>
                        <td><input type="text" class="textfield" id="username" name="username" required></td>
                    </tr>
                    <tr>
                        <td><label for="ww">Vul een wachtwoord in:</label></td>
                        <td><input type="password" class="textfield" id="ww" name="ww" required></td>
                    </tr>
                    <tr>
                        <td colspan="2"><input type="submit" name="login" id="login" value="Login"></td>
                    </tr>
                </table>
            </form>
            <?php
                if(isset($_POST['login']))
                {
                    $username=$_POST['username'];
                    $ww=$_POST['ww'];
                    $con = pg_connect("host=localhost dbname=Internationale-kaart user=".$username." password=".$ww)
                    or die ('verkeerd wachtwoord of gebruikersnaam');
                    $_SESSION['username']=$username;
                    $_SESSION['ww']=$ww;
                    pg_close($con);
                    header('Location: main.html');
                }
            ?>
        </div>
    </body>
</html>