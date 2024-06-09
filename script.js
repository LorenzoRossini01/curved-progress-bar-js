class Dial {
  constructor(container) {
    this.container = container;
    this.size = this.container.dataset.size;
    this.strokeWidth = this.size / 8;
    this.radius = this.size / 2 - this.strokeWidth / 2;
    this.value = parseFloat(this.container.dataset.value);
    this.direction = this.container.dataset.arrow;
    this.svg;
    this.defs;
    this.slice;
    this.overlay;
    this.text;
    this.arrow;
    this.create();
  }

  create() {
    this.createSvg();
    this.createDefs();
    this.createSlice();
    this.createOverlay();
    this.createText();
    this.createArrow();

    this.container.appendChild(this.svg);
  }

  createSvg() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("width", `${this.size}px`);
    this.svg.setAttribute("height", `${this.size}px`);
  }

  createDefs() {
    let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs"),
      linearGradient = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "linearGradient"
      ),
      stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop"),
      stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop"),
      stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop"),
      linearGradientBackground = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "linearGradient"
      );

    linearGradient.setAttribute("id", "linearGradient");
    // colore gradiente 1
    stop1.setAttribute("stop-color", "#fc0303");
    stop1.setAttribute("offset", "0%");
    // colore gradiente 2
    stop2.setAttribute("stop-color", "#03fc07");
    stop2.setAttribute("offset", "50%");
    // colore gradiente 3
    stop3.setAttribute("stop-color", "#031cfc");
    stop3.setAttribute("offset", "100%");

    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);
    linearGradient.appendChild(stop3);

    linearGradientBackground.setAttribute("id", "gradient-background");
    // gradient background 1
    stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("stop-color", "rgba(255,255,255,0.8)");
    stop1.setAttribute("offset", "0%");
    // gradient background 2
    stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("stop-color", "rgba(0,0,0,0)");
    stop2.setAttribute("offset", "50%");
    // gradient background 3
    stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop3.setAttribute("stop-color", "rgba(0,10,10,0.8)");
    stop3.setAttribute("offset", "100%");

    linearGradientBackground.appendChild(stop1);
    linearGradientBackground.appendChild(stop2);
    linearGradientBackground.appendChild(stop3);

    defs.appendChild(linearGradient);
    defs.appendChild(linearGradientBackground);
    this.svg.appendChild(defs);
    this.defs = defs;
  }

  createSlice() {
    let slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
    slice.setAttribute("fill", "none");
    slice.setAttribute("stroke", "url(#linearGradient)");
    slice.setAttribute("stroke-width", this.strokeWidth);
    slice.setAttribute(
      "transform",
      `translate(${this.strokeWidth / 2}, ${this.strokeWidth / 2})`
    );
    slice.setAttribute("class", "animate-draw");
    this.svg.appendChild(slice);
    this.slice = slice;
  }

  createOverlay() {
    const r = this.size / 2 - this.strokeWidth / 2;
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    // posizione overlay
    circle.setAttribute("cx", this.size / 2);
    circle.setAttribute("cy", this.size / 2);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", "url(#gradient-background)");
    circle.setAttribute("class", "animate-draw");
    this.svg.appendChild(circle);
    this.overlay = circle;
  }

  createText() {
    const fontSize = this.size / 3.5;
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", this.size / 2);
    text.setAttribute("y", this.size / 2 + fontSize / 4);
    text.setAttribute("font-family", "Roboto");
    text.setAttribute("font-size", fontSize);
    text.setAttribute("font-weight", 600);
    text.setAttribute("fill", "#ffffff");
    text.setAttribute("text-anchor", "middle");
    text.innerHTML = `${0}%`;
    this.svg.appendChild(text);
    this.text = text;
  }

  createArrow() {
    let arrowSize = this.size / 10;
    let mapDir = {
      up: [arrowSize / 2, -1],
      down: [-arrowSize / 2, 1],
    };
    let [arrowYOffset, m] = mapDir[this.direction] || [0, 0];
    let arrowPosX = this.size / 2 - arrowSize / 2,
      arrowPosY = this.size - this.size / 3 + arrowYOffset,
      arrowDOffset = m * (arrowSize / 1.5),
      arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrow.setAttribute(
      "d",
      `M 0 0 ${arrowSize} 0 ${arrowSize / 2} ${arrowDOffset} 0 0 Z`
    );
    arrow.setAttribute("fill", "none");
    arrow.setAttribute("opacity", "0.6");
    arrow.setAttribute("transform", `translate(${arrowPosX},${arrowPosY})`);
    this.svg.appendChild(arrow);
    this.arrow = arrow;
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  describeArc(x, y, radius, startAngle, endAngle) {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
    return d;
  }

  setValue(value) {
    let c = (value / 100) * 360;
    if (c === 360) c = 359.99;
    const xy = this.size / 2 - this.strokeWidth / 2;
    const d = this.describeArc(xy, xy, xy, 180, 180 + c);
    this.slice.setAttribute("d", d);
    this.text.innerHTML = `${Math.floor(value)}%`;
  }

  animateStart() {
    let startValue = parseFloat(this.text.innerHTML);
    const targetValue = this.value;
    const intervalOne = setInterval(() => {
      const p = +(startValue / targetValue).toFixed(2);
      const a = p < 0.95 ? 2 - 2 * p : 0.05;
      startValue += a;
      if (startValue >= targetValue) {
        startValue = targetValue;
        clearInterval(intervalOne);
      }
      this.setValue(startValue);
    }, 10);
  }

  animateReset() {
    this.setValue(0);
  }
}

const containers = document.getElementsByClassName("chart");
const dial = new Dial(containers[0]);
dial.animateStart();
