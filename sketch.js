var canvas_width = 1280;
var canvas_height = 720;
var box_num = 0;
class BoundingBoxes {
  constructor() {
    this.box_num = box_num;
    box_num += 1;
    console.log("New Bounding Box");
    this.coords = {
      x1: (canvas_width * 40) / 100,
      x2: (canvas_width * 60) / 100,
      y1: (canvas_height * 40) / 100,
      y2: (canvas_height * 60) / 100
    };
    this.update_region = "body";
  }
  check_touch(x, y) {
    console.log("inside check_touch");
    var padding = 20;
    var external_region = {
      x1: this.coords.x1 - padding,
      x2: this.coords.x2 + padding,
      y1: this.coords.y1 - padding,
      y2: this.coords.y2 + padding
    };
    // check external collision
    if (
      !(
        x >= external_region.x1 &&
        x <= external_region.x2 &&
        y >= external_region.y1 &&
        y <= external_region.y2
      )
    ) {
      console.log("not colliding");
      return false; // no contact with this box
    }
    var internal_region = {
      x1: this.coords.x1 + padding,
      x2: this.coords.x2 - padding,
      y1: this.coords.y1 + padding,
      y2: this.coords.y2 - padding
    };
    // check edges and vertices
    var top,
      left,
      bottom,
      right = false;
    // check if in top edge

    if (y > external_region.y1 && y < internal_region.y1) top = true;
    // check if in bottom edge
    if (y < external_region.y2 && y > internal_region.y2) bottom = true;
    // check if in left edge
    console.log(x, external_region.x1, x, internal_region.x1);
    if (x > external_region.x1 && x < internal_region.x1) left = true;
    // check if in right edge
    if (x < external_region.x2 && x > internal_region.x2) right = true;

    if (top == true && left == true) {
      this.update_region = "top_left";
      return true;
    }
    if (top && right) {
      this.update_region = "top_right";
      return true;
    }
    if (bottom && left) {
      this.update_region = "bottom_left";
      return true;
    }
    if (bottom && right) {
      this.update_region = "bottom_right";
      return true;
    }
    if (top) {
      this.update_region = "top";
      return true;
    }
    if (left) {
      this.update_region = "left";
      return true;
    }
    if (bottom) {
      this.update_region = "bottom";
      return true;
    }
    if (right) {
      this.update_region = "right";
      return true;
    }
    this.update_region = "body";
    return true;
  }
  update(x, y) {
    if (this.update_region == "top_left") {
      this.coords.x1 = x;
      this.coords.y1 = y;
    }
    if (this.update_region == "top_right") {
      this.coords.x2 = x;
      this.coords.y1 = y;
    }
    if (this.update_region == "bottom_left") {
      this.coords.x1 = x;
      this.coords.y2 = y;
    }
    if (this.update_region == "bottom_right") {
      this.coords.x2 = x;
      this.coords.y2 = y;
    }
    if (this.update_region == "top") {
      this.coords.y1 = y;
    }
    if (this.update_region == "left") {
      this.coords.x1 = x;
    }
    if (this.update_region == "bottom") {
      this.coords.y2 = y;
    }
    if (this.update_region == "right") {
      this.coords.x2 = x;
    }
    // if (this.update_region == "body") {
    //   this.coords.x1 = x;
    //   this.coords.y1 = x;
    //   this.coords.x2 = x;
    //   this.coords.y2 = x;
    // }
  }
  draw() {
    fill(255, 50, 50, 125);
    stroke(255, 50, 50);

    rect(
      this.coords.x1,
      this.coords.y1,
      this.coords.x2 - this.coords.x1,
      this.coords.y2 - this.coords.y1
    );
    fill(255, 50, 50);
    rect((this.coords.x1 + this.coords.x2) / 2 - 20, this.coords.y1 - 2, 40, 4);
    rect((this.coords.x1 + this.coords.x2) / 2 - 20, this.coords.y2 - 2, 40, 4);
    rect(this.coords.x1 - 2, (this.coords.y1 + this.coords.y2) / 2 - 20, 4, 40);
    rect(this.coords.x2 - 2, (this.coords.y1 + this.coords.y2) / 2 - 20, 4, 40);
    circle(this.coords.x1, this.coords.y1, 8);
    circle(this.coords.x1, this.coords.y2, 8);
    circle(this.coords.x2, this.coords.y1, 16);
    circle(this.coords.x2, this.coords.y2, 8);
  }
}

class CustomTouchController {
  constructor() {
    this.last_touch_started = new Date().getTime();
    this.boxes = [];
    this.selected_box = null;
  }
  start_touch(x, y) {
    this.last_touch_started = new Date().getTime();
    for (var box in this.boxes) {
      console.log(box);
      console.log(this.boxes[box]);
      if (this.boxes[box].check_touch(x, y) == true) {
        this.selected_box = this.boxes[box];
        return true;
      }
    }
  }
  drag(x, y) {
    if (this.selected_box != null) {
      this.selected_box.update(x, y);
      background(100);
      this.selected_box.draw();
    }
  }
  end_touch() {
    this.selected_box = null;
    // console.log(new Date().getTime() - this.last_touch_started);
  }
}
var custom_touch_controller;
var last_touch_time = new Date().getTime();

function setup() {
  // put setup code here
  createCanvas(1280, 720);
  background(100);
  fill(255, 255, 255);
  var box = new BoundingBoxes();
  console.log(box);
  box.draw();
  custom_touch_controller = new CustomTouchController();
  custom_touch_controller.boxes[0] = box;
  // frameRate(2);
  noLoop();
}

function draw() {
  // put drawing code here
  // background(0);
}
function touchStarted(event) {
  // console.log("touchStarted");
  console.log(event);
  fill(255);
  circle(event.pageX, event.pageY, 2);
  custom_touch_controller.start_touch(event.pageX, event.pageY);
}
function touchMoved(event) {
  // console.log("touchMoved");
  // console.log(event);
  // if (new Date().getTime() - last_touch_time > 33 / 2) {
  //   // fill(100)
  //   background(100);
  //   fill(255);
  //   circle(event.pageX, event.pageY, 10);
  //   rect(0, 0, event.pageX, event.pageY);
  //   last_touch_time = new Date().getTime();
  // }
  custom_touch_controller.drag(event.pageX, event.pageY);
  // console.log(touches);
}
function touchEnded(event) {
  // console.log("touchEnded");
  // console.log(event);
  fill(255);
  circle(event.pageX, event.pageY, 2);
  custom_touch_controller.end_touch();
}
// function mouseClicked(event) {
// console.log("mouseclicked");
// console.log(event);
// fill(255);
// circle(event.x, event.y, 30);
// }
