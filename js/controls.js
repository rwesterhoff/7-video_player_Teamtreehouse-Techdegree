function Container(id, className, state) {
    this.id = id;
    this.className = className;
    this.state = state;
}

Container.prototype.createContainer = function(parent) {
    var container = document.createElement('div');
    container.setAttribute('id', this.id);
    container.setAttribute('class', this.className);
    container.setAttribute('data-state', this.state);
    parent.appendChild(container);
};

Container.prototype.toHTML = function() {
    var controlsHTML = '<div';
    controlsHTML += ' id="' + this.id + '"';
    controlsHTML += ' class="' + this.className + '"';
    controlsHTML += ' data-state="' + this.state + '"';
    controlsHTML += '>';
    controlsHTML += '</div>';
    return controlsHTML;
};

function ControlsGroup(id, content) {
    this.id = id;
    this.content = content;
}

ControlsGroup.prototype.toHTML = function() {
    var controlsHTML = '<div';
    controlsHTML += ' id="' + this.id + '"';
    controlsHTML += '>';
    controlsHTML += this.content;
    controlsHTML += '</div>';
    return controlsHTML;
};

function Progress(id) {
    this.id = id;
}

Progress.prototype.toHTML = function() {
    var controlsHTML = '<span';
    controlsHTML += ' id="' + this.id + '"';
    controlsHTML += '>';
    controlsHTML += '</span>';
    return controlsHTML;
};

function Button(id, srt, text) {
    this.id = id;
    this.srt = srt;
    this.text = text;
}

Button.prototype.toHTML = function() {
    var controlsHTML = '<button';
    controlsHTML += ' id="' + this.id + '"';
    if (this.srt) {
        controlsHTML += ' class="srt"';
    }
    controlsHTML += '>';
    controlsHTML += this.text;
    controlsHTML += '</button>';
    return controlsHTML;
};

function Indicator(id) {
    this.id = id;
}

Indicator.prototype.toHTML = function() {
    var controlsHTML = '<span';
    controlsHTML += ' id="' + this.id + '"';
    controlsHTML += ' class="indicator"';
    controlsHTML += '>';
    controlsHTML += '</span>';
    return controlsHTML;
};

function Slider(id, min, max, step, value) {
    this.id = id;
    this.min = min;
    this.max = max;
    this.step = step;
    this.value = value;
}

Slider.prototype.toHTML = function() {
    var controlsHTML = '<input';
    controlsHTML += ' type="range"';
    controlsHTML += ' id="' + this.id + '"';
    controlsHTML += ' min="' + this.min + '"';
    controlsHTML += ' max="' + this.max + '"';
    controlsHTML += ' step="' + this.step + '"';
    controlsHTML += ' value="' + this.value + '"';
    controlsHTML += '>';
    return controlsHTML;
};
