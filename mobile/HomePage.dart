import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'package:http/http.dart' as http;
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flip_card/flip_card.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:stop_watch_timer/stop_watch_timer.dart';

final String searchSetUserAlphaURL =
    'https://athena18.herokuapp.com/api/searchuserneedsalpha';
final String infoUserURL = 'https://athena18.herokuapp.com/api/infouser';
final String deleteSetURL = 'https://athena18.herokuapp.com/api/deleteset';
final String unlikeSetURL = 'https://athena18.herokuapp.com/api/unlike';
String id, token;
List<CardSet> setList = new List<CardSet>();
String nameOfSetCreator = "";
List<String> userInfoList = new List<String>();

class HomePage extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _HomeState();
  }
}

class _HomeState extends State<HomePage> {
  var db = SharedPreferences.getInstance();

  Future<List<String>> getID() async {
    List<String> list = new List<String>();
    var pref = await db;
    var userId = pref.getString('id');
    var userToken = pref.getString('token');
    list.add(userId);
    list.add(userToken);

    return list;
  }

  Future<String> getToken() async {
    var pref = await db;
    var userToken = pref.getString('token');
    return userToken;
  }

  @override
  void initState() {
    super.initState();

    getID().then((value) {
      id = value[0];
      token = value[1];

      // API call to get list in order to create setList and add setNames to cards
      callSearchSetUserAlpha(token, id, "").then((value) {
        setState(() {
          setList = value.setList;
        });
      });

      // Get the id
      getID();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        // fixes pixel overflow issue caused by keyboard covering materials
        resizeToAvoidBottomPadding: false,
        body: Center(
            child: Form(
                // key: _formKey,
                child: createCardList(context))));
  }

  Scaffold createCardList(BuildContext context) {
    if (setList == null) {
      print("ERROR::CREATECARDLIST::SETLIST");
      return null;
    }
    return Scaffold(
        appBar: AppBar(
            backgroundColor: Colors.black,
            title: Center(
              child: Row(children: <Widget>[
                const Text(
                  "My Sets",
                  style: TextStyle(color: Colors.amber, fontSize: 50),
                  textAlign: TextAlign.center,
                ),
                Spacer(),
                RaisedButton(
                  onPressed: () async {
                    setList.clear();
                    Navigator.pop(context);
                  },
                  color: Colors.white70,
                  child: const Text(
                    "Logout",
                    style: TextStyle(fontSize: 20.0, color: Colors.black),
                  ),
                )
              ]),
            )),
        backgroundColor: Colors.black26,
        body: ListView.builder(
            // CHANGE ITEM COUNT ********************************************************************
            itemCount: setList.length,
            itemBuilder: (BuildContext context, int index) {
              return Card(
                color: Color(0xff303030),
                child: Column(
                  children: <Widget>[
                    ListTile(
                      title: Text(setList[index].setName,
                          style: TextStyle(
                              color: Color(0xffffca28), fontSize: 30)),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: <Widget>[
                        SizedBox(
                          width: 18,
                        ),
                        Text(
                          "Created By: " + setList[index].userName,
                          textAlign: TextAlign.left,
                          style:
                              TextStyle(color: Color(0xffffecb3), fontSize: 15),
                        ),
                        Spacer(),
                        TextButton(
                            child: const Text("View",
                                style: TextStyle(fontSize: 18)),
                            onPressed: () {
                              // ************** Go to View Page ****************************************
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => ViewPage(
                                          index, setList[index].cards)));
                            }),
                        getRemoveButton(
                            context, index, setList[index].creatorID),
                      ],
                    )
                  ],
                ),
              );
            }));
  }

  // ########################### Deletion/Remove #################################
  Widget getRemoveButton(BuildContext context, int index, String creatorId) {
    if (creatorId == id) {
      return TextButton(
          child: Text("Delete",
              textAlign: TextAlign.right,
              style: TextStyle(fontSize: 18, color: Colors.red)),
          onPressed: () {
            showDeleteDialog(context, index);
          });
    } else
      return TextButton(
          child: Text("Unlike",
              textAlign: TextAlign.right,
              style: TextStyle(fontSize: 18, color: Colors.red)),
          onPressed: () {
            showUnlikeDialog(context, index);
          });
  }

// Popup Dialog Alert for Deletion Confirmation
  showDeleteDialog(BuildContext context, int index) {
    AlertDialog deleteAlert = AlertDialog(
      title: Text("Delete"),
      content: Text("Are you sure you want to delete this set?"),
      actions: [
        FlatButton(
            child: Text("Cancel", style: TextStyle(color: Colors.blue)),
            onPressed: () {
              Navigator.of(context).pop();
            }),
        FlatButton(
          child: Text("Delete", style: TextStyle(color: Colors.blue)),
          // Handles Delete API call
          onPressed: () async {
            getID().then((value) {
              id = value[0];
            });

            final http.Response response = await http.post(deleteSetURL,
                headers: <String, String>{
                  'Authorization': 'Bearer $token',
                  'Content-Type': 'application/json; charset=UTF-8',
                },
                body:
                    jsonEncode(<String, String>{'_id': setList[index].setID}));
            if (response.statusCode == 200) {
              callSearchSetUserAlpha(token, id, "").then((value) {
                setState(() {
                  setList = value.setList;
                });
              });
            } else {
              print(
                  "ERROR::HOMEPAGE::SHOWDELETEDIALOG::DELETEBUTTON::Unsuccessful Delete API call");
            }

            Navigator.of(context).pop();
          },
        )
      ],
    );

    showDialog(
        context: context,
        builder: (BuildContext context) {
          return deleteAlert;
        });
  }

// Popup Dialog Alert for Unlike Confirmation
  showUnlikeDialog(BuildContext context, int index) {
    AlertDialog unlikeAlert = AlertDialog(
      title: Text("Unlike"),
      content: Text("Are you sure you want to unlike this set?"),
      actions: [
        FlatButton(
            child: Text("Cancel", style: TextStyle(color: Colors.blue)),
            onPressed: () {
              Navigator.of(context).pop();
            }),
        FlatButton(
          child: Text("Unlike", style: TextStyle(color: Colors.blue)),
          // Handles Unlike API call
          onPressed: () async {
            getID().then((value) {
              id = value[0];
            });

            final http.Response response = await http.post(unlikeSetURL,
                headers: <String, String>{
                  'Authorization': 'Bearer $token',
                  'Content-Type': 'application/json; charset=UTF-8',
                },
                body: jsonEncode(
                    <String, String>{"SetId": setList[index].setID}));

            if (response.statusCode == 200) {
              callSearchSetUserAlpha(token, id, "").then((value) {
                setState(() {
                  setList = value.setList;
                });
              });
            } else {
              print(
                  "ERROR::HOMEPAGE::SHOWUNLIKEDIALOG::UNLIKEBUTTON::Unsuccessful Unlike API call");
            }
            Navigator.of(context).pop();
          },
        )
      ],
    );

    showDialog(
        context: context,
        builder: (BuildContext context) {
          return unlikeAlert;
        });
  }
  // ################################ View Page ###########################################

  //########################### Classes and API call ######################################
// ---------------- Attempt to get Cards ----------------------------------------------------
  Future<SetList> callSearchSetUserAlpha(_token, _userID, _search) async {
    final http.Response response = await http.post(searchSetUserAlphaURL,
        headers: <String, String>{
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'Search': _search,
        }));

    if (response.statusCode == 200) {
      List<dynamic> mySetList = json.decode(response.body);
      SetList instance = SetList(mySetList, new List<CardSet>());
      instance.addToList();

      if (instance == null) {
        print("ERROR::HOMEPAGE::callSearchSetUserAlpha::instance ");
        return null;
      } else if (instance.setList == null) {
        print("ERROR::HOMEPAGE::callSearchSetUserAlpha::instance.setList ");
        return null;
      }

      // infoUser API CALL ---------------------------------------------

      for (int i = 0; i < instance.setList.length; i++) {
        final http.Response response2 = await http.post(infoUserURL,
            headers: <String, String>{
              'Content-Type': 'application/json; charset=UTF-8',
            },
            body: jsonEncode(<String, String>{
              'UserId': instance.setList[i].creatorID,
            }));

        if (response.statusCode == 200) {
          instance.setList[i].userName =
              (UserInfo.fromJson(json.decode(response2.body)).username);
        }
      }

      // return instance of SetList class
      return instance;
    } else
      return null;
  }
}

// ------------------------------ Card Class ----------------------------------------
class Cards {
  final String cardID;
  String question;
  String answer;

  Cards(this.cardID, this.question, this.answer);

  factory Cards.fromJson(dynamic json) {
    return Cards(json['_id'] as String, json['Question'] as String,
        json['Answer'] as String);
  }
}

class CardList {
  List<Cards> cardList;
  List<dynamic> myCardListDynamic;
  CardList(this.myCardListDynamic, this.cardList);

  // Add all the JSON card sets to the List of Card Sets
  void addToList() {
    if (myCardListDynamic == null) {
      print("ERROR::CARDLIST::ADDTOLIST()::myCardListDynamic");
      return;
    }
    for (int i = 0; i < myCardListDynamic.length; i++) {
      cardList.add(Cards.fromJson(myCardListDynamic[i]));
    }
  }
}

// ----------------------------- CardSet Class --------------------------------------
class CardSet {
  final String setID;
  // bool public;
  List<dynamic> likedBy;
  String creatorID;
  String setName;
  List<Cards> cards;
  String dateCreated;
  String userName;

  CardSet(this.setID, this.likedBy, this.creatorID, this.setName, this.cards,
      this.dateCreated);

  // Return no instance of user with data from JSON
  factory CardSet.fromJson(dynamic json) {
    // print(json);
    CardList instance =
        CardList(json['Cards'] as List<dynamic>, new List<Cards>());
    instance.addToList();

    // print(instance.cardList.length);

    return CardSet(
        json['_id'] as String,
        // json['Public'] as bool,
        json['LikedBy'] as List<dynamic>,
        json['Creator'] as String,
        json['Name'] as String,
        instance.cardList,
        json['CreatedAt'] as String);
  }
}

// ----------------------------- SetList Class -------------------------------------
class SetList {
  List<CardSet> setList;
  List<dynamic> mySetListDynamic;
  SetList(this.mySetListDynamic, this.setList);

  // Add all the JSON card sets to the List of Card Sets
  void addToList() {
    if (mySetListDynamic == null) {
      print("ERROR::SETLIST::ADDTOLIST()::myCardListDynamic");
      return;
    }
    for (int i = 0; i < mySetListDynamic.length; i++) {
      setList.add(CardSet.fromJson(mySetListDynamic[i]));
    }
  }
}

// -------------------------- User Info Class -----------------------------------------
class UserInfo {
  final String id;
  final String username;
  List createdCardSets;
  List likedCardSets;
  List following;
  List followers;
  final String createdTime;
  String error;

  UserInfo(this.id, this.username, this.createdCardSets, this.likedCardSets,
      this.following, this.followers, this.createdTime, this.error);

  // Return no instance of user with data from JSON
  factory UserInfo.fromJson(dynamic json) {
    print("-------");
    // print(jsonObj['ret']['_id']);
    // print(jsonObj);
    return UserInfo(
        json['_id'] as String,
        json['Username'] as String,
        json['CreateCardSets'] as List<dynamic>,
        json['LikedCardSets'] as List<dynamic>,
        json['Following'] as List<dynamic>,
        json['Followers'] as List<dynamic>,
        json['CreatedAt'] as String,
        json['error'] as String);
  }
}

// ###############################################################################################
// ############################################# View Page ########################################
// ###############################################################################################

class ViewPage extends StatefulWidget {
  int setIndex;
  List<Cards> shuffleCards;
  ViewPage(this.setIndex, this.shuffleCards);

  @override
  State<StatefulWidget> createState() {
    return _ViewState(setIndex, shuffleCards);
  }
}

class _ViewState extends State<ViewPage> {
  int index = 0;
  int setIndex;
  List<Cards> shuffleCards;
  _ViewState(this.setIndex, this.shuffleCards);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        // fixes pixel overflow issue caused by keyboard covering materials
        resizeToAvoidBottomPadding: false,
        body: Center(
            child: Form(
                // key: _formKey,
                child: createCards(context))));
  }

  Scaffold createCards(BuildContext context) {
    int length = shuffleCards.length;
    int locationIndex = index + 1;
    return Scaffold(
        appBar: AppBar(
            backgroundColor: Colors.black,
            title: Center(
              child: Row(children: <Widget>[
                SizedBox(
                    height: 50.0,
                    width: 150,
                    child: AutoSizeText(
                      setList[setIndex].setName,
                      style: TextStyle(color: Colors.amber, fontSize: 50),
                      textAlign: TextAlign.center,
                      maxLines: 3,
                      minFontSize: 20,
                    )),
                Spacer(),
                RaisedButton(
                  onPressed: () async {
                    setList.clear();
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  color: Colors.white70,
                  child: const Text(
                    "Logout",
                    style: TextStyle(fontSize: 20.0, color: Colors.black),
                  ),
                )
              ]),
            )),
        backgroundColor: Colors.black26,
        body: Column(children: <Widget>[
          SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Text("$locationIndex / $length",
                  style: TextStyle(color: Colors.white)),
              SizedBox(width: 77),
              SizedBox(
                  width: 100,
                  height: 30,
                  child: IconButton(
                      color: Colors.white60,
                      icon: Icon(Icons.shuffle),
                      onPressed: () async {
                        setState(() {
                          shuffleCards.shuffle();
                        });
                      })),
              SizedBox(width: 20)
            ],
          ),
          SizedBox(height: 15),
          Flexible(
              child: PageView.builder(
                  // CHANGE ITEM COUNT ********************************************************************
                  itemCount: shuffleCards.length, //setList.length,
                  // scrollDirection: Axis.horizontal,
                  controller: PageController(viewportFraction: 0.8),
                  onPageChanged: (int _index) => setState(() => index = _index),
                  itemBuilder: (BuildContext context, i) {
                    return Transform.scale(
                        scale: i == index ? 1 : 0.9,
                        child: Container(
                            child: FlipCard(
                          direction: FlipDirection.HORIZONTAL,
                          front: Card(
                              color: Color(0xff303030),
                              // color: Colors.white60,
                              elevation: 6,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20)),
                              child: Center(
                                  child: SizedBox(
                                      width: 270.0,
                                      height: 250.0,
                                      child: AutoSizeText(
                                        shuffleCards[index].question,
                                        style: TextStyle(
                                            color: Color(0xffffecb3),
                                            fontSize: 20),
                                        minFontSize: 15,
                                        maxLines: 15,
                                        textAlign: TextAlign.center,
                                      )))),
                          back: Card(
                              color: Color(0xff303030),
                              // color: Colors.white60,
                              elevation: 6,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20)),
                              child: Center(
                                  child: SizedBox(
                                      width: 270.0,
                                      height: 250.0,
                                      child: AutoSizeText(
                                        shuffleCards[index].answer,
                                        style: TextStyle(
                                            color: Color(0xffffecb3),
                                            fontSize: 20),
                                        minFontSize: 15,
                                        maxLines: 15,
                                        textAlign: TextAlign.center,
                                      )))),
                        )));
                  })),
          SizedBox(height: 60),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              RaisedButton(
                  child: Text("Back"),
                  onPressed: () {
                    Navigator.pop(context);
                  }),
              RaisedButton(
                  child: Text("Play Match"),
                  onPressed: () {
                    if (setList[setIndex].cards.length > 2) {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => MatchPage(
                                  setIndex, setList[setIndex].cards)));
                    } else {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) =>
                                  NotEnoughPage(setIndex, shuffleCards)));
                    }
                  })
            ],
          ),
          SizedBox(height: 60)
        ]));
  }
}

// ##########################################################################################
// ##################### Page for Not Enough Sets to Play Match #############################
// ##########################################################################################
class NotEnoughPage extends StatefulWidget {
  int setIndex;
  List<Cards> shuffleCards;
  NotEnoughPage(this.setIndex, this.shuffleCards);

  @override
  State<StatefulWidget> createState() {
    return _NotEnoughState(setIndex, shuffleCards);
  }
}

class _NotEnoughState extends State<NotEnoughPage> {
  int index = 0;
  int setIndex;
  List<Cards> shuffleCards;
  _NotEnoughState(this.setIndex, this.shuffleCards);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        // fixes pixel overflow issue caused by keyboard covering materials
        resizeToAvoidBottomPadding: false,
        body: Center(child: Form(child: createNotEnough(context))));
  }

  Scaffold createNotEnough(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            backgroundColor: Colors.black,
            title: Center(
              child: Row(children: <Widget>[
                SizedBox(
                    height: 50.0,
                    width: 150,
                    child: AutoSizeText(
                      setList[setIndex].setName,
                      style: TextStyle(color: Colors.amber, fontSize: 50),
                      textAlign: TextAlign.center,
                      maxLines: 3,
                      minFontSize: 20,
                    )),
                Spacer(),
                RaisedButton(
                  onPressed: () async {
                    setList.clear();
                    Navigator.pop(context);
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  color: Colors.white70,
                  child: const Text(
                    "Logout",
                    style: TextStyle(fontSize: 20.0, color: Colors.black),
                  ),
                )
              ]),
            )),
        backgroundColor: Colors.black26,
        body: Column(children: <Widget>[
          SizedBox(width: 150, height: 150),
          Center(
              child: Text(
                  "You need a minimum of three cards to play Match. \n            "
                  "Visit the website to add more.",
                  style: TextStyle(color: Color(0xffffecb3)))),
          SizedBox(width: 200, height: 150),
          RaisedButton(
              child: Text("Back"),
              onPressed: () {
                Navigator.pop(context);
              }),
          SizedBox(width: 200, height: 150),
        ]));
  }
}

// ###############################################################################################
// ############################################# MATCHING ########################################
// ###############################################################################################
bool q1state = false;
bool a1state = false;
bool q2state = false;
bool a2state = false;
bool q3state = false;
bool a3state = false;
List<int> val = [1, 2, 3, 4, 5, 6];
bool firstState = true;
int completedScore = 0;

class MatchPage extends StatefulWidget {
  int setIndex;
  List<Cards> shuffleCards;
  MatchPage(this.setIndex, this.shuffleCards);

  @override
  State<StatefulWidget> createState() {
    return _MatchState(setIndex, shuffleCards);
  }
}

class _MatchState extends State<MatchPage> {
  int setIndex;
  List<Cards> shuffleCards;
  List<Widget> qaList;
  Set<int> _rnd;
  _MatchState(this.setIndex, this.shuffleCards);
  final StopWatchTimer _stopWatchTimer = StopWatchTimer();

  @override
  Widget build(BuildContext context) {
    if (firstState) _stopWatchTimer.onExecute.add(StopWatchExecute.start);
    return Scaffold(
        // fixes pixel overflow issue caused by keyboard covering materials
        resizeToAvoidBottomPadding: false,
        body: Center(
            child: Form(
                // key: _formKey,
                child: createCards(context))));
  }

  Scaffold createCards(BuildContext context) {
    qaList = _QAListStart(setIndex, val);
    qaList.shuffle();
    print(completedScore);

    if (completedScore == 3) {
      _stopWatchTimer.onExecute.add(StopWatchExecute.stop);
    }

    return Scaffold(
        appBar: AppBar(
            backgroundColor: Colors.black,
            title: Center(
              child: Row(children: <Widget>[
                SizedBox(
                    height: 50.0,
                    width: 150,
                    child: AutoSizeText(
                      "Match",
                      style: TextStyle(color: Colors.amber, fontSize: 50),
                      textAlign: TextAlign.center,
                      maxLines: 3,
                      minFontSize: 20,
                    )),
                Spacer(),
                RaisedButton(
                  onPressed: () async {
                    setList.clear();
                    Navigator.pop(context);
                    Navigator.pop(context);
                    Navigator.pop(context);
                    q1state = false;
                    a1state = false;
                    q2state = false;
                    a2state = false;
                    q3state = false;
                    a3state = false;
                    firstState = true;
                    completedScore = 0;
                    _stopWatchTimer.onExecute.add(StopWatchExecute.stop);
                  },
                  color: Colors.white70,
                  child: const Text(
                    "Logout",
                    style: TextStyle(fontSize: 20.0, color: Colors.black),
                  ),
                )
              ]),
            )),
        backgroundColor: Colors.black26,
        body: Container(
            margin: EdgeInsets.all(0),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  SizedBox(height: 10),
                  StreamBuilder<int>(
                      stream: _stopWatchTimer.rawTime,
                      initialData: _stopWatchTimer.rawTime.value,
                      builder: (context, snap) {
                        final value = snap.data;
                        final displayTime =
                            StopWatchTimer.getDisplayTime(value, second: true);
                        return Container(
                          child: Text(displayTime,
                              style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 30,
                                  fontWeight: FontWeight.bold)),
                        );
                      }),
                  SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      qaList.elementAt(0),
                      qaList.elementAt(1),
                    ],
                  ),
                  SizedBox(height: 50),
                  Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [qaList.elementAt(2), qaList.elementAt(3)]),
                  SizedBox(height: 50),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [qaList.elementAt(4), qaList.elementAt(5)],
                  ),
                  SizedBox(height: 30),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      RaisedButton(
                          child: Text("Back"),
                          onPressed: () {
                            Navigator.pop(context);
                            q1state = false;
                            a1state = false;
                            q1state = false;
                            a1state = false;
                            q2state = false;
                            a2state = false;
                            q3state = false;
                            a3state = false;
                            firstState = true;
                            completedScore = 0;
                            _stopWatchTimer.onExecute
                                .add(StopWatchExecute.stop);
                          }),
                      RaisedButton(
                          child: Text("Reset"),
                          onPressed: () async {
                            setState(() {
                              q1state = false;
                              a1state = false;
                              q1state = false;
                              a1state = false;
                              q2state = false;
                              a2state = false;
                              q3state = false;
                              a3state = false;
                              firstState = true;
                              completedScore = 0;
                              _stopWatchTimer.onExecute
                                  .add(StopWatchExecute.reset);
                            });
                          })
                    ],
                  ),
                  SizedBox(height: 60)
                ])));
  }

  // ################################# Matching Q/A Methods #####################################

  // Randomly generate list of question and answers for matching
  List<Widget> _QAListStart(sIndex, val) {
    List<Widget> _list = new List<Widget>();
    List<int> indexRand = new List<int>();
    // int indexRand;
    print(indexRand);

    if (firstState) {
      final _random = new Random();
      int min = 0;
      int max = setList[sIndex].cards.length;
      print("max");
      print(max);
      _rnd = new Set<int>();
      int r = 0;
      // indexRand = 0;
      for (int i = 0; i < 3; i++) {
        r = min + _random.nextInt(max - min);
        if (_rnd.contains(r)) i = i - 1;
        _rnd.add(r);
      }
    }

    for (int i = 0; i < 3; i++) {
      if (setList[sIndex].cards.length == 0) return null;

      indexRand.add(_rnd.elementAt(i));

      // do a check for less than 3 or 2 and determine whether or not to have a random bank of quesitons and answers
      print(_rnd.elementAt(i));
      switch (i) {
        case 0:
          {
            print("adding q1/a1");
            _list.add(getQ1Match(sIndex, val, indexRand[i]));
            _list.add(getA1Match(sIndex, val, indexRand[i]));
            break;
          }
        case 1:
          {
            print("adding q2/a2");
            _list.add(getQ2Match(sIndex, val, indexRand[i]));
            _list.add(getA2Match(sIndex, val, indexRand[i]));
            break;
          }
        case 2:
          {
            print("adding q3/a3");
            _list.add(getQ3Match(sIndex, val, indexRand[i]));
            _list.add(getA3Match(sIndex, val, indexRand[i]));
            break;
          }
      }
    }
    return _list;
  }

  // Methods for each individual card for a question and an answer
  Widget getQ1Match(int index, List<int> val, int qaIndex) {
    if (q1state) {
      return SizedBox(
        width: 100,
        height: 100,
      );
    } else {
      return DragTarget(
        builder: (context, List<int> checkData, rejectedData) {
          print(checkData);
          return Draggable(
              data: val[0],
              child: Container(
                  width: 100,
                  height: 100,
                  // color: Colors.amber,
                  child: Center(
                      child: AutoSizeText(
                          setList[index].cards[qaIndex].question,
                          style: TextStyle(color: Colors.white)))),
              feedback: Container(
                  width: 100,
                  height: 100,
                  alignment: Alignment.center,
                  // color: Colors.amber,
                  child: AutoSizeText(setList[index].cards[qaIndex].question,
                      style: TextStyle(color: Colors.white, fontSize: 15.0))));
        },
        onWillAccept: (data) {
          if (data == val[3]) {
            print("accept");
            return true;
          } else {
            print("incorrect");
            return false;
          }
        },
        onAccept: (data) {
          setState(() {
            q1state = true;
            a1state = true;
            firstState = false;
            completedScore++;
          });

          print("accepted");
        },
      );
    }
  }

  Widget getA1Match(int index, List<int> val, int qaIndex) {
    if (a1state) {
      return SizedBox(
        width: 100,
        height: 100,
      );
    } else {
      return DragTarget(
        builder: (context, List<int> checkData, rejectedData) {
          print(checkData);
          return Draggable(
              data: val[3],
              child: Container(
                  width: 100,
                  height: 100,
                  child: Center(
                      child: AutoSizeText(setList[index].cards[qaIndex].answer,
                          style: TextStyle(color: Colors.white)))),
              feedback: Container(
                  width: 100,
                  height: 100,
                  alignment: Alignment.center,
                  child: AutoSizeText(setList[index].cards[qaIndex].answer,
                      style: TextStyle(color: Colors.white, fontSize: 15.0))));
        },
        onWillAccept: (data) {
          if (data == val[0]) {
            print("accept");
            return true;
          } else {
            print("incorrect");
            return false;
          }
        },
        onAccept: (data) {
          setState(() {
            q1state = true;
            a1state = true;
            firstState = false;
            completedScore++;
          });

          print("accepted");
        },
      );
    }
  }

  Widget getQ2Match(int index, List<int> val, int qaIndex) {
    if (q2state) {
      return SizedBox(
        width: 100,
        height: 100,
      );
    } else {
      return DragTarget(
        builder: (context, List<int> checkData, rejectedData) {
          print(checkData);
          return Draggable(
              data: val[1],
              child: Container(
                  width: 100,
                  height: 100,
                  child: Center(
                      child: AutoSizeText(
                          setList[index].cards[qaIndex].question,
                          style: TextStyle(color: Colors.white)))),
              feedback: Container(
                  width: 100,
                  height: 100,
                  alignment: Alignment.center,
                  child: AutoSizeText(setList[index].cards[qaIndex].question,
                      style: TextStyle(color: Colors.white, fontSize: 15.0))));
        },
        onWillAccept: (data) {
          if (data == val[4]) {
            print("accept");
            return true;
          } else {
            print("incorrect");
            return false;
          }
        },
        onAccept: (data) {
          setState(() {
            q2state = true;
            a2state = true;
            firstState = false;
            completedScore++;
          });

          print("accepted");
        },
      );
    }
  }

  Widget getA2Match(int index, List<int> val, int qaIndex) {
    if (a2state) {
      return SizedBox(
        width: 100,
        height: 100,
      );
    } else {
      return DragTarget(
        builder: (context, List<int> checkData, rejectedData) {
          print(checkData);
          return Draggable(
              data: val[4],
              child: Container(
                  width: 100,
                  height: 100,
                  child: Center(
                      child: AutoSizeText(setList[index].cards[qaIndex].answer,
                          style: TextStyle(color: Colors.white)))),
              feedback: Container(
                  width: 100,
                  height: 100,
                  alignment: Alignment.center,
                  child: AutoSizeText(setList[index].cards[qaIndex].answer,
                      style: TextStyle(color: Colors.white, fontSize: 15.0))));
        },
        onWillAccept: (data) {
          if (data == val[1]) {
            print("accept");
            return true;
          } else {
            print("incorrect");
            return false;
          }
        },
        onAccept: (data) {
          setState(() {
            q2state = true;
            a2state = true;
            firstState = false;
            completedScore++;
          });

          print("accepted");
        },
      );
    }
  }

  Widget getQ3Match(int index, List<int> val, int qaIndex) {
    if (q3state) {
      return SizedBox(
        width: 100,
        height: 100,
      );
    } else {
      return DragTarget(
        builder: (context, List<int> checkData, rejectedData) {
          print(checkData);
          return Draggable(
              data: val[2],
              child: Container(
                  width: 100,
                  height: 100,
                  child: Center(
                      child: AutoSizeText(
                          setList[index].cards[qaIndex].question,
                          style: TextStyle(color: Colors.white)))),
              feedback: Container(
                  width: 100,
                  height: 100,
                  alignment: Alignment.center,
                  child: AutoSizeText(setList[index].cards[qaIndex].question,
                      style: TextStyle(color: Colors.white, fontSize: 15.0))));
        },
        onWillAccept: (data) {
          if (data == val[5]) {
            print("accept");
            return true;
          } else {
            print("incorrect");
            return false;
          }
        },
        onAccept: (data) {
          setState(() {
            q3state = true;
            a3state = true;
            firstState = false;
            completedScore++;
          });

          print("accepted");
        },
      );
    }
  }

  Widget getA3Match(int index, List<int> val, int qaIndex) {
    if (a3state) {
      return SizedBox(
        width: 100,
        height: 100,
      );
    } else {
      return DragTarget(
        builder: (context, List<int> checkData, rejectedData) {
          print(checkData);
          return Draggable(
              data: val[5],
              child: Container(
                  width: 100,
                  height: 100,
                  child: Center(
                      child: AutoSizeText(setList[index].cards[qaIndex].answer,
                          style: TextStyle(color: Colors.white)))),
              feedback: Container(
                  width: 100,
                  height: 100,
                  alignment: Alignment.center,
                  child: AutoSizeText(setList[index].cards[qaIndex].answer,
                      style: TextStyle(color: Colors.white, fontSize: 15.0))));
        },
        onWillAccept: (data) {
          if (data == val[2]) {
            print("accept");
            return true;
          } else {
            print("incorrect");
            return false;
          }
        },
        onAccept: (data) {
          setState(() {
            q3state = true;
            a3state = true;
            firstState = false;
            completedScore++;
          });

          print("accepted");
        },
      );
    }
  }
}
