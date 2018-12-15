var wid = 800
var hei = 800
var fps = 5;

var used_tooth_picks = [];
var inactive_ends = {};
var unused_tooth_picks = []; // tooth picks with at least one active ends

var max_x =  2; 
var max_y =  2;
var min_x = -2;
var min_y = -2;

var gen = 1;
var cnt = 1;

function generateToothPick(active_end, other_end) { // orientation is important
  
  if ( active_end.x == other_end.x ) { // vert tooth pick
    return [
      { 
        x: (active_end.x + 1), 
        y: (active_end.y),
      }, 
      { 
        x: (active_end.x - 1), 
        y: (active_end.y),
      }, 
    ]
  } else { // hori tooth pick
      return [
      { 
        x: (active_end.x), 
        y: (active_end.y + 1),
      }, 
      { 
        x: (active_end.x), 
        y: (active_end.y - 1),
      }, 
    ]
  }
  
}

function InactivateEnd(end, tooth_pick_box) {
  tooth_pick_box[JSON.stringify(end)] = true
}

function checkEndInctivated(end, tooth_pick_box) {
  return ( JSON.stringify(end) in tooth_pick_box );
}

function updateMinMax(tooth_pick) {
  var first_end = tooth_pick[0]
  var second_end = tooth_pick[1]
  
  if ( tooth_pick[0].x < min_x ) min_x = tooth_pick[0].x
  if ( tooth_pick[0].y < min_y ) min_y = tooth_pick[0].y
  if ( tooth_pick[0].x > max_x ) max_x = tooth_pick[0].x
  if ( tooth_pick[0].y > max_y ) max_y = tooth_pick[0].y
  
  if ( tooth_pick[1].x < min_x ) min_x = tooth_pick[1].x
  if ( tooth_pick[1].y < min_y ) min_y = tooth_pick[1].y
  if ( tooth_pick[1].x > max_x ) max_x = tooth_pick[1].x
  if ( tooth_pick[1].y > max_y ) max_y = tooth_pick[1].y
}

function addToothPicks() {

  var first_end = null;
  var sec_end = null;
  
  var tmp_tooth_picks = [];
  var new_tooth_pick = null;

  while ( unused_tooth_picks.length > 0 ) {
    
    first_end = unused_tooth_picks[0][0]
    sec_end = unused_tooth_picks[0][1]
    
    if (checkEndInctivated(first_end, inactive_ends)) {
      // do nothing
    } else { // Active
      new_tooth_pick = generateToothPick(first_end, sec_end) 
      updateMinMax(new_tooth_pick)
      tmp_tooth_picks.push(new_tooth_pick)
      InactivateEnd(first_end, inactive_ends)
      cnt += 1; // update tooth pick count
    }
    
    if (checkEndInctivated(sec_end, inactive_ends)) {
      // do nothing
    } else { // Active
      new_tooth_pick = generateToothPick(sec_end, first_end) 
      updateMinMax(new_tooth_pick)
      tmp_tooth_picks.push(new_tooth_pick)
      InactivateEnd(sec_end, inactive_ends)
      cnt += 1; // update tooth pick count
    }
    
    used_tooth_picks.push(unused_tooth_picks.shift())
    
  }
  
  var tmp_ends = {}
  for ( var t = 0; t < tmp_tooth_picks.length; t += 1 ) {
    first_end = tmp_tooth_picks[t][0]
    sec_end = tmp_tooth_picks[t][1]
    
    if ( checkEndInctivated(first_end, tmp_ends) ) InactivateEnd(first_end, inactive_ends) ;// Two activated ends meet to form two inactivated ends
    else tmp_ends[JSON.stringify(first_end)] = true
    
    if ( checkEndInctivated(sec_end, tmp_ends) ) InactivateEnd(sec_end, inactive_ends) ;// Two activated ends meet to form two inactivated ends
    else tmp_ends[JSON.stringify(sec_end)] = true
    
  }
  
  while ( tmp_tooth_picks.length > 0 ) {
    unused_tooth_picks.push(tmp_tooth_picks.shift())
  }
  
}

function drawToothPicksOnCanvas(tooth_pick) {
  //console.log(tooth_pick)
  line(
    (tooth_pick[0].x-min_x)/(max_x-min_x)*wid*0.8+wid*0.1, 
    (tooth_pick[0].y-min_y)/(max_y-min_y)*hei*0.8+hei*0.1, 
    (tooth_pick[1].x-min_x)/(max_x-min_x)*wid*0.8+wid*0.1, 
    (tooth_pick[1].y-min_y)/(max_y-min_y)*hei*0.8+hei*0.1
  );
}

function setup() {
  createCanvas(wid, hei);
  strokeWeight(1);
  stroke(0);
  frameRate(fps);
  textFont('Georgia');
  textSize(12);
  
  unused_tooth_picks.push([
    { x:  0, y:  1 },
    { x:  0, y: -1 }
  ])
}

function draw() {
  
  background(100);
  
  text('Number of tooth picks :: '+cnt.toString(), 10, 20);
  text('Number of generations :: '+gen.toString(), 10, 35);
  
  for (var i = 0; i < used_tooth_picks.length; i += 1) {
    drawToothPicksOnCanvas(used_tooth_picks[i]);
  }
  
  for (var i = 0; i < unused_tooth_picks.length; i += 1) {
    drawToothPicksOnCanvas(unused_tooth_picks[i]);
  }

  gen += 1;
  addToothPicks()

}