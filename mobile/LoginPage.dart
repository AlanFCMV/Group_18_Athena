import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'HomePage.dart';
import 'package:jaguar_jwt/jaguar_jwt.dart';

class LoginPage extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _LoginState();
  }
}

enum FormType { login, register, forgot }

class _LoginState extends State<LoginPage> {
  Future<User> _futureUser;
  String _username, _email, _password, _cpassword = "", serverCode;
  final _formKey = GlobalKey<FormState>();
  FormType _formType = FormType.login;
  FocusNode _usernameFocusNode = FocusNode();
  FocusNode _passwordFocusNode = FocusNode();
  FocusNode _emailFocusNode = FocusNode();
  FocusNode _cpasswordFocusNode = FocusNode();
  final TextEditingController _pass = TextEditingController();
  final TextEditingController _confirmPass = TextEditingController();
  final TextEditingController _userControl = TextEditingController();
  final TextEditingController _passwordControl = TextEditingController();
  final String loginUrl = 'https://athena18.herokuapp.com/api/login';
  final String registerUrl = 'https://athena18.herokuapp.com/api/register';
  final String resetUrl = 'https://athena18.herokuapp.com/api/reset';
  bool loggedIn = false;
  bool _failLogin = false;
  bool _failRegister = false;
  bool registerSubmit = false;
  bool _failReset = false;
  bool resetSubmit = false;
  String loggedInName = "";
  String userID;
  String token;

  @override
  Widget build(BuildContext context) {
    return Scaffold(

        // fixes pixel overflow issue caused by keyboard covering materials
        resizeToAvoidBottomPadding: false,
        body: Center(
            child: Form(
                key: _formKey,
                child: Column(children: createInputs() + createButtons()))));
  }

  void gotoLogin() {
    _formKey.currentState.reset();
    _userControl.clear();
    _passwordControl.clear();
    setState(() {
      _formType = FormType.login;
    });
  }

  void gotoRegister() {
    _formKey.currentState.reset();
    _userControl.clear();
    _passwordControl.clear();
    registerSubmit = false;
    setState(() {
      _formType = FormType.register;
    });
  }

  void gotoForgotPassword() {
    _formKey.currentState.reset();
    _userControl.clear();
    _passwordControl.clear();
    resetSubmit = false;
    setState(() {
      _formType = FormType.forgot;
    });
  }

  bool validateForm() {
    final form = _formKey.currentState;

    if (form.validate()) {
      form.save();
      return true;
    } else
      return false;
  }

// ----------------------------------------- Login Page------------------------------------
  List<Widget> createInputs() {
    if (_formType == FormType.login) {
      return [
        // adjust spacing between logo and app bar
        SizedBox(height: 100),

        // logo
        Container(
            width: 350,
            alignment: Alignment.topCenter,
            child: Image.asset('assets/AthenaTextLogo.png')),

        // add spacing between logo and input boxes
        SizedBox(height: 45),

        // Username/ Email input box
        Container(
          width: 350,
          alignment: Alignment.topCenter,
          child: TextFormField(
            controller: _userControl,
            focusNode: _usernameFocusNode,
            keyboardType: TextInputType.text,
            style: TextStyle(color: Colors.amber[100]),
            decoration: InputDecoration(
              enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.amber[700])),
              labelText: 'Username or Email',
              labelStyle: TextStyle(color: Colors.amber[700]),
              errorText: _failLogin ? '' : null,
            ),
            textInputAction: TextInputAction.next,
            validator: (name) {
              if (name.isEmpty)
                return 'Username is required.';
              else
                return null;
            },
            onSaved: (name) => _username = name,
            onFieldSubmitted: (_) {
              fieldFocusChange(context, _usernameFocusNode, _passwordFocusNode);
            },
          ),
        ),

        // add space between username/email and password boxes
        SizedBox(height: 10),

        // password input box
        Container(
          width: 350,
          alignment: Alignment.center,
          child: TextFormField(
            controller: _passwordControl,
            focusNode: _passwordFocusNode,
            keyboardType: TextInputType.text,
            style: TextStyle(color: Colors.amber[100]),
            obscureText: true,
            decoration: InputDecoration(
              suffixIcon: Icon(Icons.lock),
              enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.amber[700])),
              labelText: 'Password',
              labelStyle: TextStyle(color: Colors.amber[700]),
              errorText: _failLogin ? 'Invalid Username or Password' : null,
            ),
            textInputAction: TextInputAction.done,
            validator: (password) {
              if (password.isEmpty)
                return 'Password is required.';
              else
                return null;
            },
            onSaved: (password) => _password = password,
          ),
        ),

        // Add space between password input box and login button
        SizedBox(height: 10),
      ];
    } else if (_formType == FormType.register) {
      //  ---------------------------- Register Page ---------------------------------
      return [
        // adjust spacing between logo and app bar
        SizedBox(height: 100),

        // logo
        Container(
            width: 350,
            alignment: Alignment.topCenter,
            child: Image.asset('assets/AthenaTextLogo.png')),

        // add spacing between logo and input boxes
        SizedBox(height: 45),

        // Username input box
        Container(
          width: 350,
          alignment: Alignment.topCenter,
          child: TextFormField(
            focusNode: _usernameFocusNode,
            keyboardType: TextInputType.text,
            style: TextStyle(color: Colors.amber[100]),
            decoration: InputDecoration(
                enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.amber[700])),
                labelText: 'Username',
                labelStyle: TextStyle(color: Colors.amber[700])),
            textInputAction: TextInputAction.next,
            validator: (name) {
              if (name.isEmpty)
                return 'Username is required.';
              else
                return null;
            },
            onSaved: (name) => _username = name,
            onFieldSubmitted: (_) {
              fieldFocusChange(context, _usernameFocusNode, _emailFocusNode);
            },
          ),
        ),

        // add space between username and email boxes
        SizedBox(height: 10),

        // Email input box
        Container(
          width: 350,
          alignment: Alignment.topCenter,
          child: TextFormField(
            focusNode: _emailFocusNode,
            keyboardType: TextInputType.text,
            style: TextStyle(color: Colors.amber[100]),
            decoration: InputDecoration(
                enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.amber[700])),
                labelText: 'Email',
                labelStyle: TextStyle(color: Colors.amber[700])),
            textInputAction: TextInputAction.next,
            validator: (email) {
              if (email.isEmpty)
                return 'Email is required.';
              else
                return null;
            },
            onSaved: (email) => _email = email,
            onFieldSubmitted: (_) {
              fieldFocusChange(context, _emailFocusNode, _passwordFocusNode);
            },
          ),
        ),
        // password input box

        // add space between email and password boxes
        SizedBox(height: 10),

        Container(
          width: 350,
          alignment: Alignment.center,
          child: TextFormField(
            focusNode: _passwordFocusNode,
            keyboardType: TextInputType.text,
            style: TextStyle(color: Colors.amber[100]),
            obscureText: true,
            decoration: InputDecoration(
                suffixIcon: Icon(Icons.lock),
                enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.amber[700])),
                labelText: 'Password',
                labelStyle: TextStyle(color: Colors.amber[700])),
            textInputAction: TextInputAction.done,
            controller: _pass,
            validator: (password) {
              if (password.isEmpty)
                return 'Password is required.';
              else
                return null;
            },
            onSaved: (password) => _password = password,
            onFieldSubmitted: (_) {
              fieldFocusChange(
                  context, _passwordFocusNode, _cpasswordFocusNode);
            },
          ),
        ),

        // add space between password and confirm password boxes
        SizedBox(height: 10),

        Container(
          width: 350,
          alignment: Alignment.center,
          child: TextFormField(
            focusNode: _cpasswordFocusNode,
            keyboardType: TextInputType.text,
            style: TextStyle(color: Colors.amber[100]),
            obscureText: true,
            decoration: InputDecoration(
              suffixIcon: Icon(Icons.lock),
              enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.amber[700])),
              labelText: 'Re-enter Password',
              labelStyle: TextStyle(color: Colors.amber[700]),
              errorText:
                  _failRegister ? 'There was an error, try again.' : null,
              helperText: !_failRegister && registerSubmit
                  ? 'Your account has been successfully registered!'
                  : null,
              helperStyle: TextStyle(color: Colors.amber[700]),
            ),
            textInputAction: TextInputAction.done,
            controller: _confirmPass,
            validator: (cpassword) {
              if (cpassword.isEmpty)
                return 'Password validation is required.';
              else if (cpassword != _pass.text)
                return 'Passwords do not match.';
              else
                return null;
            },
          ),
        ),

        // Add space between confirm password box and login button
        SizedBox(height: 10),
      ];
    } else {
      return [
        // adjust spacing between logo and app bar
        SizedBox(height: 100),

        // logo
        Container(
            width: 350,
            alignment: Alignment.topCenter,
            child: Image.asset('assets/AthenaTextLogo.png')),

        // add spacing between logo and input boxes
        SizedBox(height: 45),

        // Email input box
        Container(
          width: 350,
          alignment: Alignment.topCenter,
          child: TextFormField(
            controller: _userControl,
            keyboardType: TextInputType.text,
            style: TextStyle(color: Colors.amber[100]),
            decoration: InputDecoration(
              enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.amber[700])),
              labelText: 'Email',
              labelStyle: TextStyle(color: Colors.amber[700]),
              errorText: _failReset ? 'There was an error, try again.' : null,
              helperText: !_failReset && resetSubmit
                  ? 'If your email is associated with an account, check your inbox.'
                  : null,
              helperStyle: TextStyle(color: Colors.amber[700]),
            ),
            textInputAction: TextInputAction.next,
            validator: (email) {
              if (email.isEmpty)
                return 'Email is required.';
              else
                return null;
            },
            onSaved: (email) => _email = email,
            onFieldSubmitted: (_) {
              callResetPassword(_email);
            },
          ),
        ),

        // add space between email form and resend button
        SizedBox(height: 10),
      ];
    }
  }

// ---------------------------------- Preferences ----------------------------------------------
  // Upon login, save a logged in boolean, as well as the username of the logged in user
  _saveLogin(String username, String userID) async {
    // Set loggedIn boolean to true because our login succeeded, use SharedPreferences to store
    final prefs = await SharedPreferences.getInstance();
    final loginKey = 'loginStatus';
    final loginValue = true;
    prefs.setBool(loginKey, loginValue);

    // Use SharedPreferences to store the username
    final userKey = 'username';
    final userValue = username;
    prefs.setString(userKey, userValue);

    // Use SharedPreferences to store the user's ID
    final idKey = 'id';
    final idValue = userID;
    prefs.setString(idKey, idValue);

    final tokenKey = 'token';
    final tokenValue = token;
    prefs.setString(tokenKey, token);
  }

// ---------------------------- Buttons ------------------------------------------------------
  List<Widget> createButtons() {
    if (_formType == FormType.login) {
      return [
        new RaisedButton(
          onPressed: () async {
            // Save form data
            if (_formKey.currentState.validate()) {
              _formKey.currentState.save();
            }

            // API Call
            _futureUser = callLogin(_username, _password);

            // Now grab the username of the logged in user and pass it into the saving function
            await _futureUser.then((value) => {
                  print(value.id),
                  print(value.username),
                  loggedInName = value.username,
                  userID = value.id,
                  token = value.token
                });

            setState(() {
              if (loggedInName == _username) {
                _failLogin = false;
                _saveLogin(loggedInName, userID);
                _userControl.clear();
                _passwordControl.clear();
                fieldFocusChange(
                    context, _passwordFocusNode, _usernameFocusNode);
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => HomePage()));
              } else {
                _failLogin = true;
              }
            });
          },
          child: const Text("Login", style: TextStyle(fontSize: 16.0)),
          color: Colors.amber[700],
        ), // This trailing comma makes auto-formatting nicer for build methods.

        new TextButton(
          onPressed: gotoRegister,
          child: const Text("Create Account?",
              style: TextStyle(fontSize: 14.0, color: Colors.grey)),
        ),
        new TextButton(
          onPressed: gotoForgotPassword,
          child: const Text("Forgot Password?",
              style: TextStyle(fontSize: 14.0, color: Colors.grey)),
        )
      ];
    } else if (_formType == FormType.register) {
      return [
        new RaisedButton(
          onPressed: () {
            // Save form data
            if (_formKey.currentState.validate()) {
              _formKey.currentState.save();
            }

            // API Call
            setState(() {
              Future<int> response = callRegister(_username, _email, _password);

              response.then((value) => {
                setState(() {
                  registerSubmit = true;
                  if (value == 200) {
                    _failRegister = false;
                  } else
                    _failRegister = true;
                })
              });
            });
          },
          child: const Text("Sign Up", style: TextStyle(fontSize: 16.0)),
          color: Colors.amber[700],
        ), // This trailing comma makes auto-formatting nicer for build methods.

        new TextButton(
          onPressed: gotoLogin,
          child: const Text("Return to Login",
              style: TextStyle(fontSize: 14.0, color: Colors.grey)),
        )
      ];
    } else {
      return [
        new RaisedButton(
          onPressed: () async {
            // Save form data
            if (_formKey.currentState.validate()) {
              _formKey.currentState.save();
            }

            // API Call
            Future<int> response = callResetPassword(_email);

            response.then((value) => {
                  setState(() {
                    resetSubmit = true;
                    if (value == 200) {
                      _failReset = false;
                    } else
                      _failReset = true;
                  })
                });
          },
          child: const Text("Reset Password", style: TextStyle(fontSize: 16.0)),
          color: Colors.amber[700],
        ), // This trailing comma makes auto-formatting nicer for build methods.

        new TextButton(
          onPressed: gotoLogin,
          child: const Text("Return to Login",
              style: TextStyle(fontSize: 14.0, color: Colors.grey)),
        ),
      ];
    }
  }

// --------------------------------- API Calls ----------------------------------------------
  // Post API call at form submission
  Future<User> callLogin(_username, _password) async {
    final http.Response response = await http.post(loginUrl,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'Login': _username,
          'Password': _password,
        }));

    if (response.statusCode == 200) {
      _failLogin = false;
      return User.fromJson(jsonDecode(response.body)); // return new user object
    } else {
      _failLogin = true;
      return User(username: "null");
    }
  }

  // Post API call at form submission
  Future<int> callRegister(username, email, password) async {
    final http.Response response = await http.post(registerUrl,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          "Username": username,
          "Email": email,
          "Password": password,
        }));

    return response.statusCode;
  }

  void fieldFocusChange(
      BuildContext context, FocusNode currentFocus, FocusNode nextFocus) {
    currentFocus.unfocus();
    FocusScope.of(context).requestFocus(nextFocus);
  }

  Future<int> callResetPassword(email) async {
    final http.Response response = await http.post(resetUrl,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          "Email": email,
        }));

    return response.statusCode;
  }
}

// ----------------------------------------- User Class ----------------------------
class User {
  final String id;
  final String token;
  final String username;
  User({
    this.id,
    this.token,
    this.username,
  });

  // Return no instance of user with data from JSON
  factory User.fromJson(Map<String, dynamic> jsonObj) {
    String toke = jsonObj['accessToken'];
    print(toke);
    final tokeParts = toke.split('.');
    final load = tokeParts[1];

    final String decoded = B64urlEncRfc7515.decodeUtf8(load);
    print(decoded);
    FromToken instance = FromToken.fromJson(json.decode(decoded));

    return User(token: toke, id: instance.id, username: instance.username);
  }
}

class FromToken {
  String id;
  String username;
  FromToken(this.id, this.username);

  factory FromToken.fromJson(dynamic json) {
    print(json['UserId'] as String);
    return FromToken(json['UserId'] as String, json['Username']);
  }
}
