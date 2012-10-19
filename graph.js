
/* vectors */

function Vec3(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Vec3.prototype.abs = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}

Vec3.prototype.norm = function() {
  var m = this.abs();
  if (Math.abs(m) < 0.0000000001) return new Vec3(0.0, 0.0, 0.0);
  return new Vec3(this.x / m, this.y / m, this.z / m);
}

Vec3.cross = function(a, b) {
  return new Vec3(a.y*b.z - a.z*b.y, a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x);
}

/* matrices */

Mat4 = {};

Mat4.ortho = function(x, y, z, w, h, d) {
  return [
     2.0 / w,      0.0,          0.0,         0.0,
     0.0,          2.0 / h,      0.0,         0.0,
     0.0,          0.0,         -2.0 / d,     0.0,
    -2.0 * x / w, -2.0 * y / h, -2.0 * z / d, 1.0
  ];
}

Mat4.identity = function() {
  return [
    1.0, 0.0, 0.0, 0.0, 
    0.0, 1.0, 0.0, 0.0, 
    0.0, 0.0, 1.0, 0.0, 
    0.0, 0.0, 0.0, 1.0
  ];
}

Mat4.rotation = function(vec) {
  var theta = vec.abs();
  var u = vec.norm();
  var c = Math.cos(theta);
  var s = Math.sin(theta);
  return [
    u.x * u.x * (1.0 - c) + c,       u.x * u.y * (1.0 - c) - u.z * s, u.x * u.z * (1.0 - c) + u.y * s, 0.0,
    u.y * u.x * (1.0 - c) + u.z * s, u.y * u.y * (1.0 - c) + c,       u.y * u.z * (1.0 - c) - u.x * s, 0.0,
    u.z * u.x * (1.0 - c) - u.y * s, u.z * u.y * (1.0 - c) + u.x * s, u.z * u.z * (1.0 - c) + c,       0.0,
    0.0,                             0.0,                             0.0,                             1.0
  ];
}

Mat4.mul = function(a, b) {
  var result = [
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0
  ];
  for (var c=0; c < 4; c++) {
    for (var r=0; r < 4; r++) {
      var x = 0;
      for (var i=0; i < 4; i++) {
        x += a[i*4 + r] * b[c*4 + i];
      }
      result[c*4 + r] = x;
    }
  }
  return result;
}

/* complex numbers */


function sinh(a) {
  return (Math.exp(a) - Math.exp(-a)) / 2.0;
}

function cosh(a) {
  return (Math.exp(a) + Math.exp(-a)) / 2.0;
}

function tanh(a) {
  return sinh(a) / cosh(a);
}


function Complex(re, im) {
  this.re = re;
  this.im = im;
}

Complex.prototype.toString = function() {
  /*
  var epsilon = 0.000000001;
  var str = ""
  if (Math.abs(this.re) > epsilon) {
    str += this.re.toString();
  }
  if (Math.abs(this.im) > epsilon) {
    if (this.im < 0) {
      str += "-";
    } else if (Math.abs(this.re) > epsilon) {
      str += "+";
    }
    str += "i";
    var abs_im = Math.abs(this.im);
    if (Math.abs(1.0 - abs_im) > epsilon) {
      str += Math.abs(this.im).toString();
    }
  }
  return str;
  */
  var sign = this.im < 0.0 ? "-" : "+";
  return this.re.toPrecision(4) + sign + Math.abs(this.im).toPrecision(4) + "i";
}

Complex.PI  = new Complex(Math.PI, 0.0);
Complex.E   = new Complex(Math.E, 0.0);
Complex.I   = new Complex(0.0, 1.0);
Complex.ONE = new Complex(1.0, 0.0);
Complex.ZERO = new Complex(0.0, 0.0);
Complex.NEG_I = new Complex(0.0, -1.0);
Complex.NEG_ONE = new Complex(-1.0, 0.0);
Complex.HALF = new Complex(0.5, 0.0);
Complex.HALF_I = new Complex(0.0, 0.5);

Complex.add = function(a, b) {
  return new Complex(a.re + b.re, a.im + b.im);
}

Complex.sub = function(a, b) {
  return new Complex(a.re - b.re, a.im - b.im);
}

Complex.mul = function(a, b) {
  return new Complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
}

Complex.div = function(a, b) {
  var den = b.re * b.re + b.im * b.im;
  var re  = (a.re * b.re + a.im * b.im) / den;
  var im  = (a.im * b.re - a.re * b.im) / den;
  return new Complex(re, im);
}

Complex.abs = function(a) {
  return new Complex(Math.sqrt(a.re * a.re + a.im * a.im), 0.0);
}

Complex.arg = function(a) {
  return new Complex(Math.atan2(a.im, a.re), 0.0);
}

Complex.sqrt = function(a) {
  var im_sign = a.im < 0.0 ? -1.0 : 1.0;
  var r = Complex.abs(a).re;
  var re = Math.sqrt((a.re + r) / 2.0);
  var im = im_sign * Math.sqrt((-a.re + r) / 2.0);
  return new Complex(re, im);
}

Complex.sin = function(a) {
  var re = Math.sin(a.re) * cosh(a.im);
  var im = Math.cos(a.re) * sinh(a.im);
  return new Complex(re, im);
}

Complex.cos = function(a) {
  var re = Math.cos(a.re) * cosh(a.im);
  var im = -Math.sin(a.re) * sinh(a.im);
  return new Complex(re, im);
}

Complex.tan = function(a) {
  return Complex.div(Complex.sin(a), Complex.cos(a));
}

Complex.asin = function(a) { /* test this */
  var a_sq = Complex.mul(a, a);
  var i_a  = Complex.mul(Complex.I, a);
  var inner = Complex.add(i_a, Complex.sqrt(Complex.sub(Complex.ONE, a_sq)));
  return Complex.mul(Complex.NEG_I, Complex.ln(inner));
}

Complex.acos = function(a) { /* test this */
  var a_sq = Complex.mul(a, a);
  var inner = Complex.add(a, Complex.sqrt(Complex.sub(a_sq, Complex.ONE)));
  return Complex.mul(Complex.NEG_I, Complex.ln(inner));
}

Complex.atan = function(a) { /* test this */
  var i_a  = Complex.mul(Complex.I, a);
  var ln_n = Complex.ln(Complex.sub(Complex.ONE, i_a));
  var ln_p = Complex.ln(Complex.add(Complex.ONE, i_a));
  var inner = Complex.sub(ln_n, ln_p);
  return Complex.mul(Complex.HALF_I, inner);
}

Complex.conj = function(a) {
  return new Complex(a.re, -a.im);
}

Complex.exp = function(a) {
  var r = Math.exp(a.re);
  return new Complex(r * Math.cos(a.im), r * Math.sin(a.im));
}

Complex.ln = function(a) {
  var r     = Complex.abs(a).re;
  var theta = Complex.arg(a).re;
  return new Complex(Math.log(r), theta);
}

Complex.lg = function(a) {
  var r     = Complex.abs(a).re;
  var theta = Complex.arg(a).re;
  return new Complex(Math.log(r) / Math.LN10, theta);
}

Complex.lb = function(a) {
  var r     = Complex.abs(a).re;
  var theta = Complex.arg(a).re;
  return new Complex(Math.log(r) / Math.LN2, theta);
}

Complex.pow = function(a, b) {
  var epsilon = 0.00000000001;
  if (Math.abs(a.re) < epsilon && Math.abs(a.im) < epsilon) {
    return Complex.ZERO;
  }
  return Complex.exp(Complex.mul(b, Complex.ln(a)));
}

Complex.ceil = function(a) {
  return new Complex(Math.ceil(a.re), Math.ceil(a.im));
}

Complex.floor = function(a) {
  return new Complex(Math.floor(a.re), Math.floor(a.im));
}

/* these operations discard the imaginary part */
Complex.mod = function(a, b) {
  return new Complex(a.re % b.re, 0.0);
}



/* expression tree */


function Expression() {
  this.parent = null;
  this.value  = null;
}

Expression.prototype.invalidate = function() {
  this.value = null;
  if (this.parent != null) {
    this.parent.invalidate();
  }
}

Expression.prototype.toString = function() {
  return "";
}

Expression.prototype.reference = function(parent) { /* used for invalidation; overloaded by Variables, which can have many references */
  this.parent = parent;
}

Expression.construct = function(context, stack) {
  if (stack.length < 1) return null;
  var token = stack.pop();
  switch (token.type) {
    case TokenType.BINOP:
      var right = Expression.construct(context, stack);
      var left  = Expression.construct(context, stack);
      if (left == null || right == null) return null;
      var expr  = new BinaryOp(token, left, right);
      left.reference(expr);
      right.reference(expr);
      return expr;
    case TokenType.UNOP:
      var arg  = Expression.construct(context, stack);
      if (arg == null) return null;
      var expr = new UnaryOp(token, arg);
      arg.reference(expr);
      return expr;
    case TokenType.CONST:
      var value = token.value;
      var expr  = new Immediate(value);
      return expr;
    case TokenType.VAR:
      var label = token.str;
      var expr  = context.resolve(label);
      return expr;
  }
}

BinaryOp.prototype = new Expression();
BinaryOp.prototype.constructor = BinaryOp;
function BinaryOp(token, left, right) {
  Expression.prototype.constructor.call(this);
  this.str   = token.str;
  this.order = token.order;
  this.callback = token.func;
  this.left  = left;
  this.right = right;
}

BinaryOp.prototype.evaluate = function() {
  if (this.value != null) {
    return this.value;
  }
  var a = this.left.evaluate();
  var b = this.right.evaluate();
  var c = this.callback.call(this, a, b);
  this.value = c;
  return c;
}

BinaryOp.prototype.toString = function() {
  var str = this.left.toString() + " " + this.str + " " + this.right.toString();
  if (this.parent != null && this.parent.order < this.order) {
    str = "(" + str + ")";
  }
  return str;
}

UnaryOp.prototype = new Expression();
UnaryOp.prototype.constructor = UnaryOp;
function UnaryOp(token, arg) {
  Expression.prototype.constructor.call(this);
  this.str   = token.str;
  this.order = token.order;
  this.callback = token.func;
  this.arg = arg;
}

UnaryOp.prototype.evaluate = function() {
  if (this.value != null) {
    return this.value;
  }
  var a = this.arg.evaluate();
  var b = this.callback.call(this, a);
  this.value = b;
  return b;
}

UnaryOp.prototype.toString = function() {
  var str = this.str + " " + this.arg.toString();
  if (this.parent != null && this.parent.order < this.order) {
    str = "(" + str + ")";
  }
  return str;
}

Immediate.prototype = new Expression();
Immediate.prototype.constructor = Immediate;
function Immediate(value) {
  Expression.prototype.constructor.call(this);
  this.value = value
}

Immediate.prototype.evaluate = function() {
  return this.value;
}

Immediate.prototype.invalidate = function() {
  /* cannot invalidate an immediate value */
}

Immediate.prototype.toString = function() {
  return "(" + this.value.toString() + ")";
}

Variable.prototype = new Expression();
Variable.prototype.constructor = Variable;
function Variable(label, expression) {
  Expression.prototype.constructor.call(this);
  expression.reference(this);
  this.label      = label;
  this.expression = expression;
  this.references = [];
}

Variable.prototype.evaluate = function() {
  if (this.value != null) {
    return this.value;
  }
  var result = this.expression.evaluate();
  this.value = result;
  return result;
}

Variable.prototype.invalidate = function() {
  this.value = null;
  for (var key in this.references) {
    var reference = this.references[key];
    reference.invalidate();
  }
}

Variable.prototype.set = function(expression) {
  this.expression = expression;
  this.invalidate();
}

Variable.prototype.toString = function() {
  return this.label;
}

Variable.prototype.reference = function(parent) {
  this.references.push(parent);
}


/* tokens + lexer */


TokenType = {
  BINOP:   1,
  UNOP:    2,
  CONST:   3,
  VAR:     4,
  BRACKET: 5,
  ASSIGN:  6,
  SEP:     7,
};
BracketType = {
  LEFT:  1,
  RIGHT: 2
}
Associativity = {
  LEFT:  1,
  RIGHT: 2
}
Token = {
  ADD:  { type: TokenType.BINOP, str: "+", order: 3, assoc: Associativity.LEFT, func: Complex.add },
  SUB:  { type: TokenType.BINOP, str: "-", order: 3, assoc: Associativity.LEFT, func: Complex.sub },
  MUL:  { type: TokenType.BINOP, str: "*", order: 2, assoc: Associativity.LEFT, func: Complex.mul },
  DIV:  { type: TokenType.BINOP, str: "/", order: 2, assoc: Associativity.LEFT, func: Complex.div },
  MOD:  { type: TokenType.BINOP, str: "%", order: 2, assoc: Associativity.LEFT, func: Complex.mod },
  POW:  { type: TokenType.BINOP, str: "^", order: 1, assoc: Associativity.RIGHT, func: Complex.pow },
  UADD: { type: TokenType.UNOP, str: "+",    order: 0, assoc: Associativity.RIGHT, func: function(a) { return a; } },
  USUB: { type: TokenType.UNOP, str: "-",    order: 0, assoc: Associativity.RIGHT, func: function(a) { return new Complex(-a.re, -a.im); } },
  SIN:  { type: TokenType.UNOP, str: "sin",  order: 0, assoc: Associativity.RIGHT, func: Complex.sin },
  ASIN: { type: TokenType.UNOP, str: "asin", order: 0, assoc: Associativity.RIGHT, func: Complex.asin },
  COS:  { type: TokenType.UNOP, str: "cos",  order: 0, assoc: Associativity.RIGHT, func: Complex.cos },
  ACOS: { type: TokenType.UNOP, str: "acos", order: 0, assoc: Associativity.RIGHT, func: Complex.acos },
  TAN:  { type: TokenType.UNOP, str: "tan",  order: 0, assoc: Associativity.RIGHT, func: Complex.tan },
  ATAN: { type: TokenType.UNOP, str: "atan", order: 0, assoc: Associativity.RIGHT, func: Complex.atan },
  LN:   { type: TokenType.UNOP, str: "ln",   order: 0, assoc: Associativity.RIGHT, func: Complex.ln },
  LG:   { type: TokenType.UNOP, str: "lg",   order: 0, assoc: Associativity.RIGHT, func: Complex.lg },
  LB:   { type: TokenType.UNOP, str: "lb",   order: 0, assoc: Associativity.RIGHT, func: Complex.lb },
  EXP:  { type: TokenType.UNOP, str: "exp",  order: 0, assoc: Associativity.RIGHT, func: Complex.exp },
  RE:   { type: TokenType.UNOP, str: "re",   order: 0, assoc: Associativity.RIGHT, func: function(a) { return new Complex(a.re, 0.0); } },
  IM:   { type: TokenType.UNOP, str: "im",   order: 0, assoc: Associativity.RIGHT, func: function(a) { return new Complex(a.im, 0.0); } },
  ABS:  { type: TokenType.UNOP, str: "abs",  order: 0, assoc: Associativity.RIGHT, func: Complex.abs },
  SQRT: { type: TokenType.UNOP, str: "sqrt", order: 0, assoc: Associativity.RIGHT, func: Complex.sqrt },
  CEIL: { type: TokenType.UNOP, str: "ceil", order: 0, assoc: Associativity.RIGHT, func: Complex.ceil },
  FLOOR: { type: TokenType.UNOP, str: "floor", order: 0, assoc: Associativity.RIGHT, func: Complex.floor },
  E:    { type: TokenType.CONST, str: "e",  value: Complex.E },
  PI:   { type: TokenType.CONST, str: "pi", value: Complex.PI },
  I:    { type: TokenType.CONST, str: "i",  value: Complex.I },
  LPAREN: { type: TokenType.BRACKET, str: "(", order: 100, side: BracketType.LEFT, matches: null },
  RPAREN: { type: TokenType.BRACKET, str: ")", order: 100, side: BracketType.RIGHT, matches: null },
  LBRACK: { type: TokenType.BRACKET, str: "[", order: 100, side: BracketType.LEFT, matches: null },
  RBRACK: { type: TokenType.BRACKET, str: "]", order: 100, side: BracketType.RIGHT, matches: null },
  LBRACE: { type: TokenType.BRACKET, str: "{", order: 100, side: BracketType.LEFT, matches: null },
  RBRACE: { type: TokenType.BRACKET, str: "}", order: 100, side: BracketType.RIGHT, matches: null },
  EQUALS: { type: TokenType.ASSIGN, str: "=" },
  SEP:    { type: TokenType.SEP, str: ";" }
};
Token.LPAREN.matches = Token.RPAREN;
Token.RPAREN.matches = Token.LPAREN;
Token.LBRACK.matches = Token.RBRACK;
Token.RBRACK.matches = Token.LBRACK;
Token.LBRACE.matches = Token.RBRACE;
Token.RBRACE.matches = Token.LBRACE;

function Lexer(src) {
  this.src = src;
  this.cur = 0;
  this.err = null;
  this.lvalue = false; /* indicates whether the last token was a value (used to select unary/binary based on context) */
}

function isalpha(c) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

function isdecimal(c) {
  return (c >= '0' && c <= '9') || c == '.';
}

function iswhitespace(c) {
  return c == ' ' || c == '\t' || c == '\r' || c == '\n';
}

function readwhile(str, i, condition) {
  var s = ""
  for (var j=i; j < str.length; j++) {
    var c = str[j];
    if (!condition(c)) break;
    s += c;
  }
  return s;
}

Lexer.prototype.next = function() {
  var next = function() {
    for (;;) {
      if (this.cur >= this.src.length) break;
      var c = this.src[this.cur];
      
      if (iswhitespace(c)) {
        this.cur++;
      } else if (isalpha(c)) {
        var str = readwhile(this.src, this.cur, isalpha).toLowerCase();
        this.cur += str.length;
        for (key in Token) {
          var token = Token[key];
          if (token.str == str) {
            return token;
          }
        }
        return { type: TokenType.VAR, str: str }
      } else if (isdecimal(c)) {
        var str = readwhile(this.src, this.cur, isdecimal);
        this.cur += str.length;
        var value = Number(str);
        return { type: TokenType.CONST, str: str, value: new Complex(value, 0.0) };
      } else {
        this.cur++;
        switch (c) {
          case '+':
            if (this.lvalue) {
              return Token.ADD;
            } else {
              return Token.UADD;
            }
          case '-':
            if (this.lvalue) {
              return Token.SUB;
            } else {
              return Token.USUB;
            }
          case '*':
            return Token.MUL;
          case '/':
            return Token.DIV;
          case '%':
            return Token.MOD;
          case '^':
            return Token.POW;
          case '(':
            return Token.LPAREN;
          case ')':
            return Token.RPAREN;
          case '[':
            return Token.LBRACK;
          case ']':
            return Token.RBRACK;
          case '{':
            return Token.LBRACE;
          case '}':
            return Token.RBRACE;
          case '=':
            return Token.EQUALS;
          case ';':
            return Token.SEP;
          default:
            this.err = "Unrecognized character \""+c+"\""
            return null;
        }
      }
    }
    return null;
  }
  var token = next.call(this);
  if (token != null) {
    switch (token.type) {
      case TokenType.BINOP:
      case TokenType.UNOP:
        this.lvalue = false;
        break;
      case TokenType.CONST:
      case TokenType.VAR:
        this.lvalue = true;
        break;
      case TokenType.BRACKET:
        if (token.side == BracketType.LEFT) {
          this.lvalue = false;
        } else {
          this.lvalue = true;
        }
        break;
    }
  } else {
    this.lvalue = false;
  }
  return token;
}

Stack.prototype = new Array;
Stack.prototype.constructor = Stack;
function Stack() {
  Array.prototype.constructor.call(this);
}

Stack.prototype.peek = function() {
  if (this.length < 1) return null;
  return this[this.length-1];
}

function Parser(lexer) {
  this.lexer = lexer
  this.err   = null
}

Parser.prototype.parse = function() {
  var token  = this.lexer.next();
  var variables = [];
  var stack = new Stack();
  var operators = new Stack();
  
  function flush() {
    for (var top = operators.pop(); top != null; top = operators.pop()) {
      if (top.type == TokenType.BRACKET) {
        this.err = "Unmatched \"" + top.str + "\"";
        return;
      }
      stack.push(top);
    }
  }

  function clear() {
    var s = stack;
    stack = new Stack();
    return s;
  }

  var label = null;
  while (token != null) {
    switch (token.type) {
      case TokenType.BINOP:
      case TokenType.UNOP:
        for (var top = operators.peek(); top != null; top = operators.peek()) {
          if (top.order > token.order) break;
          if (token.assoc == Associativity.RIGHT && top.order == token.order) break;
          stack.push(operators.pop());
        }
        operators.push(token);
        break;
      case TokenType.CONST:
        stack.push(token);
        break;
      case TokenType.VAR:
        stack.push(token);
        break;
      case TokenType.BRACKET:
        if (token.side == BracketType.LEFT) {
          operators.push(token);
        } else if (token.side == BracketType.RIGHT) {
          for (var top = operators.peek(); top != null; top = operators.peek()) {
            if (token.matches == top) break;
            if (top.type == TokenType.BRACKET) {
              this.err = "Unmatched \"" + top.str + "\"";
              return null;
            }
            stack.push(operators.pop());
          }
          var top = operators.pop();
          if (top == null) {
            this.err = "Unmatched \"" + token.str + "\"";
            return null;
          }
        }
        break;
      case TokenType.ASSIGN:
        var top = stack.pop();
        if (top.type != TokenType.VAR) {
          this.err = "Assignment without variable";
          return null;
        }
        if (top.type != TokenType.VAR) {
          this.err = "Assignment to non-variable";
          return null;
        }
        if (stack.length > 0) {
          this.err = "Unexpected assignment";
          return null;
        }
        label = top.str;
        break;
      case TokenType.SEP:
        if (label == null) {
          this.err = "separator used in non-assignment expression";
          return null;
        }
        
        flush();
        if (this.err != null) return null;
        
        variables.push({ label: label, stack: clear() });
        label = null;
        break;
    }
    token = this.lexer.next();
  }
  
  flush();
  if (this.err != null) return null;
  
  return { variables: variables, root: clear() };
}



/* a mathematical context */

function Context(src) {
  this.x = new Variable("x", new Immediate(Complex.ONE));
  this.y = new Variable("y", new Immediate(Complex.ONE));
  this.variables = {
    x: this.x,
    y: this.y
  };
  this.err  = null;
  this.root = null;
  this.tasks = [];
  
  var lexer  = new Lexer(src);
  var parser = new Parser(lexer);
  var stack  = parser.parse();
  
  var str = "";
  if (stack == null) {
    this.err = parser.err;
  } else {
    for (var i = 0; i < stack.variables.length; i++) {
      var variable = stack.variables[i];
      var label = variable.label;
      var expr  = Expression.construct(this, variable.stack);
      if (expr == null) {
        this.err = "Incomplete expression";
        return;
      }
      this.variables[label] = new Variable(label, expr);
    }
    var expr = Expression.construct(this, stack.root);
    if (expr == null) {
      this.err = "Incomplete expression";
    } else {
      this.root = expr;
    }
  }
}

Context.prototype.resolve = function (label) {
  if (label in this.variables) {
    return this.variables[label];
  }
  return null;
}

Context.prototype.setx = function(x) { /* x should be a real Number, not a Complex */
  this.x.set(new Immediate(new Complex(x, 0.0)));
}

Context.prototype.sety = function(y) {
  this.y.set(new Immediate(new Complex(y, 0.0)));
}

Context.prototype.evaluate = function(x, y) {
  /* setting x and y invalidates most of the expression cache, avoid using this function when performance is important */
  this.setx(x);
  this.sety(y);
  return this.root.evaluate(x);
}

Context.prototype.row = function(y, xmin, xmax, steps) {
  var re = [];
  var im = [];
  this.sety(y);
  for (var i = 0; i < steps; i++) {
    var x = i * (xmax - xmin) / (steps - 1) + xmin;
    this.setx(x);
    var result = this.root.evaluate();
    re.push(x);
    re.push(y);
    re.push(result.re);
    im.push(x);
    im.push(y);
    im.push(result.im);
  }
  return { re: re, im: im };
}

Context.prototype.column = function(x, ymin, ymax, steps) {
  var re = [];
  var im = [];
  this.setx(x);
  for (var i = 0; i < steps; i++) {
    var y = i * (ymax - ymin) / (steps - 1) + ymin;
    this.sety(y);
    var result = this.root.evaluate();
    re.push(x);
    re.push(y);
    re.push(result.re);
    im.push(x);
    im.push(y);
    im.push(result.im);
  }
  return { re: re, im: im };
}

Context.prototype.toString = function() {
  var str = "";
  for (key in this.variables) {
    var variable = this.variables[key];
    str += key.toString() + " = " + variable.expression.toString() + "; ";
  }
  str += this.root.toString();
  return str;
  //return this.root.toString();
}



/* graph renderer */

function Plot3D(gl, w, h, bg, fg_re, fg_im) {
  this.gl = gl;
  this.ebo_line = [];
  this.ebo_fill = [];
  for (i in Plot3D.levels) {
    var level = Plot3D.levels[i];
    
    var ebo;

    ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(level.lines), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    this.ebo_line.push(ebo);
    
    ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(level.tris), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    this.ebo_fill.push(ebo);
  }
  this.level = -1;
  this.pending = null;
  this.verts_re = [];
  this.verts_im = [];
  this.vbo_re = null;
  this.vbo_im = null;

  this.ebo_cube = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo_cube);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Plot3D.cube.indices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  this.vbo_cube = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cube);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Plot3D.cube.verts), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  this.fg_re = new Float32Array([fg_re[0].r, fg_re[0].g, fg_re[0].b, fg_re[1].r, fg_re[1].g, fg_re[1].b]);
  this.fg_im = new Float32Array([fg_im[0].r, fg_im[0].g, fg_im[0].b, fg_im[1].r, fg_im[1].g, fg_im[1].b]);
  this.bg = bg;
  gl.viewport(0, 0, w, h);
  gl.clearColor(bg.r, bg.b, bg.g, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  this.mat_proj = Mat4.ortho(0.0, 0.0, 0.0, 2.0*w/h, 2.0, 4.0);
  //this.mat_view = Mat4.identity();
  var view_rotx = new Vec3(1.0*Math.PI/3.0, 0.0, 0.0);
  var view_rotz = new Vec3(0.0, 0.0, 1.0*Math.PI/6.0);
  this.mat_view = Mat4.mul(Mat4.rotation(view_rotx), Mat4.rotation(view_rotz));
  
  var vert_basic = this.shader(gl.VERTEX_SHADER,
    "attribute vec3 position;"+
    "uniform mat4 mat_view;"+
    "uniform mat4 mat_proj;"+
    "void main() {"+
    "  vec4 clip = mat_proj * mat_view * vec4(2.0 * position.xy - 1.0, position.z - 0.5, 1.0);"+
    "  clip.z -= 0.0001;"+
    "  gl_Position = clip;"+
    "}"
  );
  
  var frag_basic = this.shader(gl.FRAGMENT_SHADER,
    "precision mediump float;"+
    "uniform vec3 color;"+
    "void main() {"+
    "  gl_FragColor = vec4(color, 1.0);"+
    "}"
  );
  
  this.program_basic = this.program([vert_basic, frag_basic], [{'name': 'position', 'index': 0}]);
  this.uniform_basic_view  = gl.getUniformLocation(this.program_basic, "mat_view");
  this.uniform_basic_proj  = gl.getUniformLocation(this.program_basic, "mat_proj");
  this.uniform_basic_color = gl.getUniformLocation(this.program_basic, "color");

  var vert_graph = this.shader(gl.VERTEX_SHADER,
    "attribute vec3 position;"+
    "uniform mat4 mat_view;"+
    "uniform mat4 mat_proj;"+
    "varying vec3  flocal;"+
    "void main() {"+
    "  flocal      = position;"+
    "  gl_Position = mat_proj * mat_view * vec4(2.0 * position.xy - 1.0, position.z - 0.5, 1.0);"+
    "}"
  );
  
  var frag_graph = this.shader(gl.FRAGMENT_SHADER,
    "precision mediump float;"+
    "uniform vec3 color[2];"+
    "uniform vec4 hatch;"+
    "varying vec3 flocal;"+
    "void main() {"+
    "  if (flocal.z < 0.0 || flocal.z > 1.0) discard;"+
    "  if (mod(dot(gl_FragCoord.xy, hatch.xy), hatch.z) > hatch.w) discard;"+
    "  gl_FragColor = vec4(mix(color[0], color[1], flocal.z), 1.0);"+
    "}"
  );
  
  this.program_graph = this.program([vert_graph, frag_graph], [{'name': 'position', 'index': 0}]);
  this.uniform_graph_view  = gl.getUniformLocation(this.program_graph, "mat_view");
  this.uniform_graph_proj  = gl.getUniformLocation(this.program_graph, "mat_proj");
  this.uniform_graph_color = gl.getUniformLocation(this.program_graph, "color");
  this.uniform_graph_hatch = gl.getUniformLocation(this.program_graph, "hatch");
}

Plot3D.prototype.rotate = function(vec) {
  this.mat_view = Mat4.mul(Mat4.rotation(vec), this.mat_view);
}

Plot3D.prototype.draw = function() {
  if (this.vbo_re == null || this.vbo_im == null) return;
  var gl = this.gl;
  
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.frontFace(gl.CW);


  /* draw plot bounds */
  gl.useProgram(this.program_basic);

  gl.uniformMatrix4fv(this.uniform_basic_view, false, new Float32Array(this.mat_view));
  gl.uniformMatrix4fv(this.uniform_basic_proj, false, new Float32Array(this.mat_proj));

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo_cube);

  gl.enableVertexAttribArray(0);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cube);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  
  gl.uniform3f(this.uniform_basic_color, 1.0, 0.2, 0.2);
  gl.drawElements(gl.LINES, 2, gl.UNSIGNED_SHORT, 0);
  gl.uniform3f(this.uniform_basic_color, 0.2, 1.0, 0.2);
  gl.drawElements(gl.LINES, 2, gl.UNSIGNED_SHORT, 4);
  gl.uniform3f(this.uniform_basic_color, 0.2, 0.2, 1.0);
  gl.drawElements(gl.LINES, 2, gl.UNSIGNED_SHORT, 8);
  gl.uniform3f(this.uniform_basic_color, 0.7, 0.7, 0.7);
  gl.drawElements(gl.LINES, 18, gl.UNSIGNED_SHORT, 12);


  /* draw graphs */
  gl.useProgram(this.program_graph);

  gl.uniformMatrix4fv(this.uniform_graph_view, false, new Float32Array(this.mat_view));
  gl.uniformMatrix4fv(this.uniform_graph_proj, false, new Float32Array(this.mat_proj));

  gl.enableVertexAttribArray(0);

  var level = Plot3D.levels[this.level];
  var offs;

  /* outline */
  gl.uniform4f(this.uniform_graph_hatch, 0.0, 0.0, 1.0, 1.0);
  
  gl.uniform3fv(this.uniform_graph_color, this.fg_re);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_re);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  
  offs = 0;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo_line[this.level]);
  for (var y = 0; y < level.h; y++) { /* draw rows */
    gl.drawElements(gl.LINE_STRIP, level.w, gl.UNSIGNED_SHORT, offs * 2);
    offs += level.w + 1;
  }
  for (var x = 0; x < level.w; x++) { /* draw columns */
    gl.drawElements(gl.LINE_STRIP, level.h, gl.UNSIGNED_SHORT, offs * 2);
    offs += level.h + 1;
  }
  
  gl.uniform3fv(this.uniform_graph_color, this.fg_im);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_im);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  
  offs = 0;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo_line[this.level]);
  for (var y = 0; y < level.h; y++) { /* draw rows */
    gl.drawElements(gl.LINE_STRIP, level.w, gl.UNSIGNED_SHORT, offs * 2);
    offs += level.w + 1;
  }
  for (var x = 0; x < level.w; x++) { /* draw columns */
    gl.drawElements(gl.LINE_STRIP, level.h, gl.UNSIGNED_SHORT, offs * 2);
    offs += level.h + 1;
  }
  
  /* fill */
  gl.uniform3fv(this.uniform_graph_color, this.fg_re);
  gl.uniform4f(this.uniform_graph_hatch, 1.0, 1.0, 4.0, 1.0);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_re);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  
  offs = 0;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo_fill[this.level]);
  for (var y = 0; y < level.w - 1; y++) {
    gl.drawElements(gl.TRIANGLE_STRIP, 2 * level.w, gl.UNSIGNED_SHORT, offs * 2);
    offs += 2 * level.w + 1;
  }
  
  gl.uniform3fv(this.uniform_graph_color, this.fg_im);
  gl.uniform4f(this.uniform_graph_hatch, 1.0, -1.0, 4.0, 1.0);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_im);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  
  offs = 0;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo_fill[this.level]);
  for (var y = 0; y < level.w - 1; y++) {
    gl.drawElements(gl.TRIANGLE_STRIP, 2 * level.w, gl.UNSIGNED_SHORT, offs * 2);
    offs += 2 * level.w + 1;
  }
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

Plot3D.prototype.shader = function(type, src) {
  var gl = this.gl;
  
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  var status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!status) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader; 
}

Plot3D.prototype.program = function(shaders, attribs) {
  var gl = this.gl;
  
  var program = gl.createProgram();
  while (shaders.length > 0) {
    var shader = shaders.pop();
    gl.attachShader(program, shader);
  }
  while (attribs.length > 0) {
    var attrib = attribs.pop();
    gl.bindAttribLocation(program, attrib.index, attrib.name);
  }
  gl.linkProgram(program);
  var status = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!status) {
    alert(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

Plot3D.prototype.subdivide = function(mathctx) {
  var gl      = this.gl;

  if (this.level >= Plot3D.levels.length - 1) return;
  
  var i = this.level;
  var type  = i & 1;
  var num   = 1 << (i >> 1);
  var steps = (1 << ((i + 1) >> 1)) + 1;
  
  var verts_re = [];
  var verts_im = [];
  for (var i=0; i < num; i++) {
    if (type == 0) {
      var x = (2*i+1)/(2*num);
      var col = mathctx.column(x, 0.0, 1.0, steps);
      this.verts_re = this.verts_re.concat(col.re);
      this.verts_im = this.verts_im.concat(col.im);
    } else {
      var y = (2*i+1)/(2*num);
      var row = mathctx.row(y, 0.0, 1.0, steps);
      this.verts_re = this.verts_re.concat(row.re);
      this.verts_im = this.verts_im.concat(row.im);
    }
  }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_re);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verts_re), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_im);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verts_im), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  this.level++;

  this.draw();
}

Plot3D.prototype.subdivide_async = function(mathctx) {
  if (this.pending != null) {
    clearTimeout(this.pending);
  }
  this.pending = setTimeout(function(plot, mathctx) {
    plot.subdivide(mathctx);
    plot.subdivide_async(mathctx);
    this.pending = null;
  }, 0, this, mathctx);
}

Plot3D.prototype.update = function(mathctx) {
  var gl = this.gl;

  var verts_re = [];
  var verts_im = [];
  var row0 = mathctx.row(0.0, 0.0, 1.0, 2);
  var row1 = mathctx.row(1.0, 0.0, 1.0, 2);
  verts_re = verts_re.concat(row0.re);
  verts_re = verts_re.concat(row1.re);
  verts_im = verts_im.concat(row0.im);
  verts_im = verts_im.concat(row1.im);
  this.verts_re = verts_re;
  this.verts_im = verts_im;
  
  var vbo_re = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo_re);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts_re), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  this.vbo_re = vbo_re;
  
  var vbo_im = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo_im);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts_im), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  this.vbo_im = vbo_im;
  
  this.level   = 0;
  this.subdivide_async(mathctx);
  
  this.draw();
}

Plot3D.cube = {
  verts: [
    0, 0, 0, // 0
    1, 0, 0, // 1
    0, 1, 0, // 2
    1, 1, 0, // 3
    0, 0, 1, // 4
    1, 0, 1, // 5
    0, 1, 1, // 6
    1, 1, 1, // 7
  ],
  indices: [
    0, 1,
    0, 2,
    0, 4,
    1, 3,
    1, 5,
    2, 3,
    2, 6,
    3, 7,
    4, 5,
    4, 6,
    5, 7,
    6, 7
  ]
};

Plot3D.levels = [ /* line indexes for various LODs */
  {
    lines: [
	     0,    1, 65535,
	     2,    3, 65535,
	     0,    2, 65535,
	     1,    3, 65535,
    ],
    tris: [
	     0,    2,    1,    3, 65535,
    ],
    w: 2,
    h: 2
  },
  {
    lines: [
	     0,    4,    1, 65535,
	     2,    5,    3, 65535,
	     0,    2, 65535,
	     4,    5, 65535,
	     1,    3, 65535,
    ],
    tris: [
	     0,    2,    4,    5,    1,    3, 65535,
    ],
    w: 3,
    h: 2
  },
  {
    lines: [
	     0,    4,    1, 65535,
	     6,    7,    8, 65535,
	     2,    5,    3, 65535,
	     0,    6,    2, 65535,
	     4,    7,    5, 65535,
	     1,    8,    3, 65535,
    ],
    tris: [
	     0,    6,    4,    7,    1,    8, 65535,
	     6,    2,    7,    5,    8,    3, 65535,
    ],
    w: 3,
    h: 3
  },
  {
    lines: [
	     0,    9,    4,   12,    1, 65535,
	     6,   10,    7,   13,    8, 65535,
	     2,   11,    5,   14,    3, 65535,
	     0,    6,    2, 65535,
	     9,   10,   11, 65535,
	     4,    7,    5, 65535,
	    12,   13,   14, 65535,
	     1,    8,    3, 65535,
    ],
    tris:[
	     0,    6,    9,   10,    4,    7,   12,   13,    1,    8, 65535,
	     6,    2,   10,   11,    7,    5,   13,   14,    8,    3, 65535,
    ],
    w: 5,
    h: 3
  },
  {
    lines: [
	     0,    9,    4,   12,    1, 65535,
	    15,   16,   17,   18,   19, 65535,
	     6,   10,    7,   13,    8, 65535,
	    20,   21,   22,   23,   24, 65535,
	     2,   11,    5,   14,    3, 65535,
	     0,   15,    6,   20,    2, 65535,
	     9,   16,   10,   21,   11, 65535,
	     4,   17,    7,   22,    5, 65535,
	    12,   18,   13,   23,   14, 65535,
	     1,   19,    8,   24,    3, 65535,
    ],
    tris: [
	     0,   15,    9,   16,    4,   17,   12,   18,    1,   19, 65535,
	    15,    6,   16,   10,   17,    7,   18,   13,   19,    8, 65535,
	     6,   20,   10,   21,    7,   22,   13,   23,    8,   24, 65535,
	    20,    2,   21,   11,   22,    5,   23,   14,   24,    3, 65535,
    ],
    w: 5,
    h: 5
  },
  {
    lines: [
	     0,   25,    9,   30,    4,   35,   12,   40,    1, 65535,
	    15,   26,   16,   31,   17,   36,   18,   41,   19, 65535,
	     6,   27,   10,   32,    7,   37,   13,   42,    8, 65535,
	    20,   28,   21,   33,   22,   38,   23,   43,   24, 65535,
	     2,   29,   11,   34,    5,   39,   14,   44,    3, 65535,
	     0,   15,    6,   20,    2, 65535,
	    25,   26,   27,   28,   29, 65535,
	     9,   16,   10,   21,   11, 65535,
	    30,   31,   32,   33,   34, 65535,
	     4,   17,    7,   22,    5, 65535,
	    35,   36,   37,   38,   39, 65535,
	    12,   18,   13,   23,   14, 65535,
	    40,   41,   42,   43,   44, 65535,
	     1,   19,    8,   24,    3, 65535,
    ],
    tris: [
	     0,   15,   25,   26,    9,   16,   30,   31,    4,   17,   35,   36,   12,   18,   40,   41,    1,   19, 65535,
	    15,    6,   26,   27,   16,   10,   31,   32,   17,    7,   36,   37,   18,   13,   41,   42,   19,    8, 65535,
	     6,   20,   27,   28,   10,   21,   32,   33,    7,   22,   37,   38,   13,   23,   42,   43,    8,   24, 65535,
	    20,    2,   28,   29,   21,   11,   33,   34,   22,    5,   38,   39,   23,   14,   43,   44,   24,    3, 65535,
    ],
    w: 9,
    h: 5
  },
  {
    lines: [
	     0,   25,    9,   30,    4,   35,   12,   40,    1, 65535,
	    45,   46,   47,   48,   49,   50,   51,   52,   53, 65535,
	    15,   26,   16,   31,   17,   36,   18,   41,   19, 65535,
	    54,   55,   56,   57,   58,   59,   60,   61,   62, 65535,
	     6,   27,   10,   32,    7,   37,   13,   42,    8, 65535,
	    63,   64,   65,   66,   67,   68,   69,   70,   71, 65535,
	    20,   28,   21,   33,   22,   38,   23,   43,   24, 65535,
	    72,   73,   74,   75,   76,   77,   78,   79,   80, 65535,
	     2,   29,   11,   34,    5,   39,   14,   44,    3, 65535,
	     0,   45,   15,   54,    6,   63,   20,   72,    2, 65535,
	    25,   46,   26,   55,   27,   64,   28,   73,   29, 65535,
	     9,   47,   16,   56,   10,   65,   21,   74,   11, 65535,
	    30,   48,   31,   57,   32,   66,   33,   75,   34, 65535,
	     4,   49,   17,   58,    7,   67,   22,   76,    5, 65535,
	    35,   50,   36,   59,   37,   68,   38,   77,   39, 65535,
	    12,   51,   18,   60,   13,   69,   23,   78,   14, 65535,
	    40,   52,   41,   61,   42,   70,   43,   79,   44, 65535,
	     1,   53,   19,   62,    8,   71,   24,   80,    3, 65535,
    ],
    tris: [
	     0,   45,   25,   46,    9,   47,   30,   48,    4,   49,   35,   50,   12,   51,   40,   52,    1,   53, 65535,
	    45,   15,   46,   26,   47,   16,   48,   31,   49,   17,   50,   36,   51,   18,   52,   41,   53,   19, 65535,
	    15,   54,   26,   55,   16,   56,   31,   57,   17,   58,   36,   59,   18,   60,   41,   61,   19,   62, 65535,
	    54,    6,   55,   27,   56,   10,   57,   32,   58,    7,   59,   37,   60,   13,   61,   42,   62,    8, 65535,
	     6,   63,   27,   64,   10,   65,   32,   66,    7,   67,   37,   68,   13,   69,   42,   70,    8,   71, 65535,
	    63,   20,   64,   28,   65,   21,   66,   33,   67,   22,   68,   38,   69,   23,   70,   43,   71,   24, 65535,
	    20,   72,   28,   73,   21,   74,   33,   75,   22,   76,   38,   77,   23,   78,   43,   79,   24,   80, 65535,
	    72,    2,   73,   29,   74,   11,   75,   34,   76,    5,   77,   39,   78,   14,   79,   44,   80,    3, 65535,
    ],
    w: 9,
    h: 9
  },
  {
    lines: [
	     0,   81,   25,   90,    9,   99,   30,  108,    4,  117,   35,  126,   12,  135,   40,  144,    1, 65535,
	    45,   82,   46,   91,   47,  100,   48,  109,   49,  118,   50,  127,   51,  136,   52,  145,   53, 65535,
	    15,   83,   26,   92,   16,  101,   31,  110,   17,  119,   36,  128,   18,  137,   41,  146,   19, 65535,
	    54,   84,   55,   93,   56,  102,   57,  111,   58,  120,   59,  129,   60,  138,   61,  147,   62, 65535,
	     6,   85,   27,   94,   10,  103,   32,  112,    7,  121,   37,  130,   13,  139,   42,  148,    8, 65535,
	    63,   86,   64,   95,   65,  104,   66,  113,   67,  122,   68,  131,   69,  140,   70,  149,   71, 65535,
	    20,   87,   28,   96,   21,  105,   33,  114,   22,  123,   38,  132,   23,  141,   43,  150,   24, 65535,
	    72,   88,   73,   97,   74,  106,   75,  115,   76,  124,   77,  133,   78,  142,   79,  151,   80, 65535,
	     2,   89,   29,   98,   11,  107,   34,  116,    5,  125,   39,  134,   14,  143,   44,  152,    3, 65535,
	     0,   45,   15,   54,    6,   63,   20,   72,    2, 65535,
	    81,   82,   83,   84,   85,   86,   87,   88,   89, 65535,
	    25,   46,   26,   55,   27,   64,   28,   73,   29, 65535,
	    90,   91,   92,   93,   94,   95,   96,   97,   98, 65535,
	     9,   47,   16,   56,   10,   65,   21,   74,   11, 65535,
	    99,  100,  101,  102,  103,  104,  105,  106,  107, 65535,
	    30,   48,   31,   57,   32,   66,   33,   75,   34, 65535,
	   108,  109,  110,  111,  112,  113,  114,  115,  116, 65535,
	     4,   49,   17,   58,    7,   67,   22,   76,    5, 65535,
	   117,  118,  119,  120,  121,  122,  123,  124,  125, 65535,
	    35,   50,   36,   59,   37,   68,   38,   77,   39, 65535,
	   126,  127,  128,  129,  130,  131,  132,  133,  134, 65535,
	    12,   51,   18,   60,   13,   69,   23,   78,   14, 65535,
	   135,  136,  137,  138,  139,  140,  141,  142,  143, 65535,
	    40,   52,   41,   61,   42,   70,   43,   79,   44, 65535,
	   144,  145,  146,  147,  148,  149,  150,  151,  152, 65535,
	     1,   53,   19,   62,    8,   71,   24,   80,    3, 65535,
    ],
    tris: [
	     0,   45,   81,   82,   25,   46,   90,   91,    9,   47,   99,  100,   30,   48,  108,  109,    4,   49,  117,  118,   35,   50,  126,  127,   12,   51,  135,  136,   40,   52,  144,  145,    1,   53, 65535,
	    45,   15,   82,   83,   46,   26,   91,   92,   47,   16,  100,  101,   48,   31,  109,  110,   49,   17,  118,  119,   50,   36,  127,  128,   51,   18,  136,  137,   52,   41,  145,  146,   53,   19, 65535,
	    15,   54,   83,   84,   26,   55,   92,   93,   16,   56,  101,  102,   31,   57,  110,  111,   17,   58,  119,  120,   36,   59,  128,  129,   18,   60,  137,  138,   41,   61,  146,  147,   19,   62, 65535,
	    54,    6,   84,   85,   55,   27,   93,   94,   56,   10,  102,  103,   57,   32,  111,  112,   58,    7,  120,  121,   59,   37,  129,  130,   60,   13,  138,  139,   61,   42,  147,  148,   62,    8, 65535,
	     6,   63,   85,   86,   27,   64,   94,   95,   10,   65,  103,  104,   32,   66,  112,  113,    7,   67,  121,  122,   37,   68,  130,  131,   13,   69,  139,  140,   42,   70,  148,  149,    8,   71, 65535,
	    63,   20,   86,   87,   64,   28,   95,   96,   65,   21,  104,  105,   66,   33,  113,  114,   67,   22,  122,  123,   68,   38,  131,  132,   69,   23,  140,  141,   70,   43,  149,  150,   71,   24, 65535,
	    20,   72,   87,   88,   28,   73,   96,   97,   21,   74,  105,  106,   33,   75,  114,  115,   22,   76,  123,  124,   38,   77,  132,  133,   23,   78,  141,  142,   43,   79,  150,  151,   24,   80, 65535,
	    72,    2,   88,   89,   73,   29,   97,   98,   74,   11,  106,  107,   75,   34,  115,  116,   76,    5,  124,  125,   77,   39,  133,  134,   78,   14,  142,  143,   79,   44,  151,  152,   80,    3, 65535,
    ],
    w: 17,
    h: 9
  },
  {
     lines: [
	     0,   81,   25,   90,    9,   99,   30,  108,    4,  117,   35,  126,   12,  135,   40,  144,    1, 65535,
	   153,  154,  155,  156,  157,  158,  159,  160,  161,  162,  163,  164,  165,  166,  167,  168,  169, 65535,
	    45,   82,   46,   91,   47,  100,   48,  109,   49,  118,   50,  127,   51,  136,   52,  145,   53, 65535,
	   170,  171,  172,  173,  174,  175,  176,  177,  178,  179,  180,  181,  182,  183,  184,  185,  186, 65535,
	    15,   83,   26,   92,   16,  101,   31,  110,   17,  119,   36,  128,   18,  137,   41,  146,   19, 65535,
	   187,  188,  189,  190,  191,  192,  193,  194,  195,  196,  197,  198,  199,  200,  201,  202,  203, 65535,
	    54,   84,   55,   93,   56,  102,   57,  111,   58,  120,   59,  129,   60,  138,   61,  147,   62, 65535,
	   204,  205,  206,  207,  208,  209,  210,  211,  212,  213,  214,  215,  216,  217,  218,  219,  220, 65535,
	     6,   85,   27,   94,   10,  103,   32,  112,    7,  121,   37,  130,   13,  139,   42,  148,    8, 65535,
	   221,  222,  223,  224,  225,  226,  227,  228,  229,  230,  231,  232,  233,  234,  235,  236,  237, 65535,
	    63,   86,   64,   95,   65,  104,   66,  113,   67,  122,   68,  131,   69,  140,   70,  149,   71, 65535,
	   238,  239,  240,  241,  242,  243,  244,  245,  246,  247,  248,  249,  250,  251,  252,  253,  254, 65535,
	    20,   87,   28,   96,   21,  105,   33,  114,   22,  123,   38,  132,   23,  141,   43,  150,   24, 65535,
	   255,  256,  257,  258,  259,  260,  261,  262,  263,  264,  265,  266,  267,  268,  269,  270,  271, 65535,
	    72,   88,   73,   97,   74,  106,   75,  115,   76,  124,   77,  133,   78,  142,   79,  151,   80, 65535,
	   272,  273,  274,  275,  276,  277,  278,  279,  280,  281,  282,  283,  284,  285,  286,  287,  288, 65535,
	     2,   89,   29,   98,   11,  107,   34,  116,    5,  125,   39,  134,   14,  143,   44,  152,    3, 65535,
	     0,  153,   45,  170,   15,  187,   54,  204,    6,  221,   63,  238,   20,  255,   72,  272,    2, 65535,
	    81,  154,   82,  171,   83,  188,   84,  205,   85,  222,   86,  239,   87,  256,   88,  273,   89, 65535,
	    25,  155,   46,  172,   26,  189,   55,  206,   27,  223,   64,  240,   28,  257,   73,  274,   29, 65535,
	    90,  156,   91,  173,   92,  190,   93,  207,   94,  224,   95,  241,   96,  258,   97,  275,   98, 65535,
	     9,  157,   47,  174,   16,  191,   56,  208,   10,  225,   65,  242,   21,  259,   74,  276,   11, 65535,
	    99,  158,  100,  175,  101,  192,  102,  209,  103,  226,  104,  243,  105,  260,  106,  277,  107, 65535,
	    30,  159,   48,  176,   31,  193,   57,  210,   32,  227,   66,  244,   33,  261,   75,  278,   34, 65535,
	   108,  160,  109,  177,  110,  194,  111,  211,  112,  228,  113,  245,  114,  262,  115,  279,  116, 65535,
	     4,  161,   49,  178,   17,  195,   58,  212,    7,  229,   67,  246,   22,  263,   76,  280,    5, 65535,
	   117,  162,  118,  179,  119,  196,  120,  213,  121,  230,  122,  247,  123,  264,  124,  281,  125, 65535,
	    35,  163,   50,  180,   36,  197,   59,  214,   37,  231,   68,  248,   38,  265,   77,  282,   39, 65535,
	   126,  164,  127,  181,  128,  198,  129,  215,  130,  232,  131,  249,  132,  266,  133,  283,  134, 65535,
	    12,  165,   51,  182,   18,  199,   60,  216,   13,  233,   69,  250,   23,  267,   78,  284,   14, 65535,
	   135,  166,  136,  183,  137,  200,  138,  217,  139,  234,  140,  251,  141,  268,  142,  285,  143, 65535,
	    40,  167,   52,  184,   41,  201,   61,  218,   42,  235,   70,  252,   43,  269,   79,  286,   44, 65535,
	   144,  168,  145,  185,  146,  202,  147,  219,  148,  236,  149,  253,  150,  270,  151,  287,  152, 65535,
	     1,  169,   53,  186,   19,  203,   62,  220,    8,  237,   71,  254,   24,  271,   80,  288,    3, 65535,
    ],
    tris: [
	     0,  153,   81,  154,   25,  155,   90,  156,    9,  157,   99,  158,   30,  159,  108,  160,    4,  161,  117,  162,   35,  163,  126,  164,   12,  165,  135,  166,   40,  167,  144,  168,    1,  169, 65535,
	   153,   45,  154,   82,  155,   46,  156,   91,  157,   47,  158,  100,  159,   48,  160,  109,  161,   49,  162,  118,  163,   50,  164,  127,  165,   51,  166,  136,  167,   52,  168,  145,  169,   53, 65535,
	    45,  170,   82,  171,   46,  172,   91,  173,   47,  174,  100,  175,   48,  176,  109,  177,   49,  178,  118,  179,   50,  180,  127,  181,   51,  182,  136,  183,   52,  184,  145,  185,   53,  186, 65535,
	   170,   15,  171,   83,  172,   26,  173,   92,  174,   16,  175,  101,  176,   31,  177,  110,  178,   17,  179,  119,  180,   36,  181,  128,  182,   18,  183,  137,  184,   41,  185,  146,  186,   19, 65535,
	    15,  187,   83,  188,   26,  189,   92,  190,   16,  191,  101,  192,   31,  193,  110,  194,   17,  195,  119,  196,   36,  197,  128,  198,   18,  199,  137,  200,   41,  201,  146,  202,   19,  203, 65535,
	   187,   54,  188,   84,  189,   55,  190,   93,  191,   56,  192,  102,  193,   57,  194,  111,  195,   58,  196,  120,  197,   59,  198,  129,  199,   60,  200,  138,  201,   61,  202,  147,  203,   62, 65535,
	    54,  204,   84,  205,   55,  206,   93,  207,   56,  208,  102,  209,   57,  210,  111,  211,   58,  212,  120,  213,   59,  214,  129,  215,   60,  216,  138,  217,   61,  218,  147,  219,   62,  220, 65535,
	   204,    6,  205,   85,  206,   27,  207,   94,  208,   10,  209,  103,  210,   32,  211,  112,  212,    7,  213,  121,  214,   37,  215,  130,  216,   13,  217,  139,  218,   42,  219,  148,  220,    8, 65535,
	     6,  221,   85,  222,   27,  223,   94,  224,   10,  225,  103,  226,   32,  227,  112,  228,    7,  229,  121,  230,   37,  231,  130,  232,   13,  233,  139,  234,   42,  235,  148,  236,    8,  237, 65535,
	   221,   63,  222,   86,  223,   64,  224,   95,  225,   65,  226,  104,  227,   66,  228,  113,  229,   67,  230,  122,  231,   68,  232,  131,  233,   69,  234,  140,  235,   70,  236,  149,  237,   71, 65535,
	    63,  238,   86,  239,   64,  240,   95,  241,   65,  242,  104,  243,   66,  244,  113,  245,   67,  246,  122,  247,   68,  248,  131,  249,   69,  250,  140,  251,   70,  252,  149,  253,   71,  254, 65535,
	   238,   20,  239,   87,  240,   28,  241,   96,  242,   21,  243,  105,  244,   33,  245,  114,  246,   22,  247,  123,  248,   38,  249,  132,  250,   23,  251,  141,  252,   43,  253,  150,  254,   24, 65535,
	    20,  255,   87,  256,   28,  257,   96,  258,   21,  259,  105,  260,   33,  261,  114,  262,   22,  263,  123,  264,   38,  265,  132,  266,   23,  267,  141,  268,   43,  269,  150,  270,   24,  271, 65535,
	   255,   72,  256,   88,  257,   73,  258,   97,  259,   74,  260,  106,  261,   75,  262,  115,  263,   76,  264,  124,  265,   77,  266,  133,  267,   78,  268,  142,  269,   79,  270,  151,  271,   80, 65535,
	    72,  272,   88,  273,   73,  274,   97,  275,   74,  276,  106,  277,   75,  278,  115,  279,   76,  280,  124,  281,   77,  282,  133,  283,   78,  284,  142,  285,   79,  286,  151,  287,   80,  288, 65535,
	   272,    2,  273,   89,  274,   29,  275,   98,  276,   11,  277,  107,  278,   34,  279,  116,  280,    5,  281,  125,  282,   39,  283,  134,  284,   14,  285,  143,  286,   44,  287,  152,  288,    3, 65535,
    ],
    w: 17,
    h: 17
  },
  {
    lines: [
	     0,  289,   81,  306,   25,  323,   90,  340,    9,  357,   99,  374,   30,  391,  108,  408,    4,  425,  117,  442,   35,  459,  126,  476,   12,  493,  135,  510,   40,  527,  144,  544,    1, 65535,
	   153,  290,  154,  307,  155,  324,  156,  341,  157,  358,  158,  375,  159,  392,  160,  409,  161,  426,  162,  443,  163,  460,  164,  477,  165,  494,  166,  511,  167,  528,  168,  545,  169, 65535,
	    45,  291,   82,  308,   46,  325,   91,  342,   47,  359,  100,  376,   48,  393,  109,  410,   49,  427,  118,  444,   50,  461,  127,  478,   51,  495,  136,  512,   52,  529,  145,  546,   53, 65535,
	   170,  292,  171,  309,  172,  326,  173,  343,  174,  360,  175,  377,  176,  394,  177,  411,  178,  428,  179,  445,  180,  462,  181,  479,  182,  496,  183,  513,  184,  530,  185,  547,  186, 65535,
	    15,  293,   83,  310,   26,  327,   92,  344,   16,  361,  101,  378,   31,  395,  110,  412,   17,  429,  119,  446,   36,  463,  128,  480,   18,  497,  137,  514,   41,  531,  146,  548,   19, 65535,
	   187,  294,  188,  311,  189,  328,  190,  345,  191,  362,  192,  379,  193,  396,  194,  413,  195,  430,  196,  447,  197,  464,  198,  481,  199,  498,  200,  515,  201,  532,  202,  549,  203, 65535,
	    54,  295,   84,  312,   55,  329,   93,  346,   56,  363,  102,  380,   57,  397,  111,  414,   58,  431,  120,  448,   59,  465,  129,  482,   60,  499,  138,  516,   61,  533,  147,  550,   62, 65535,
	   204,  296,  205,  313,  206,  330,  207,  347,  208,  364,  209,  381,  210,  398,  211,  415,  212,  432,  213,  449,  214,  466,  215,  483,  216,  500,  217,  517,  218,  534,  219,  551,  220, 65535,
	     6,  297,   85,  314,   27,  331,   94,  348,   10,  365,  103,  382,   32,  399,  112,  416,    7,  433,  121,  450,   37,  467,  130,  484,   13,  501,  139,  518,   42,  535,  148,  552,    8, 65535,
	   221,  298,  222,  315,  223,  332,  224,  349,  225,  366,  226,  383,  227,  400,  228,  417,  229,  434,  230,  451,  231,  468,  232,  485,  233,  502,  234,  519,  235,  536,  236,  553,  237, 65535,
	    63,  299,   86,  316,   64,  333,   95,  350,   65,  367,  104,  384,   66,  401,  113,  418,   67,  435,  122,  452,   68,  469,  131,  486,   69,  503,  140,  520,   70,  537,  149,  554,   71, 65535,
	   238,  300,  239,  317,  240,  334,  241,  351,  242,  368,  243,  385,  244,  402,  245,  419,  246,  436,  247,  453,  248,  470,  249,  487,  250,  504,  251,  521,  252,  538,  253,  555,  254, 65535,
	    20,  301,   87,  318,   28,  335,   96,  352,   21,  369,  105,  386,   33,  403,  114,  420,   22,  437,  123,  454,   38,  471,  132,  488,   23,  505,  141,  522,   43,  539,  150,  556,   24, 65535,
	   255,  302,  256,  319,  257,  336,  258,  353,  259,  370,  260,  387,  261,  404,  262,  421,  263,  438,  264,  455,  265,  472,  266,  489,  267,  506,  268,  523,  269,  540,  270,  557,  271, 65535,
	    72,  303,   88,  320,   73,  337,   97,  354,   74,  371,  106,  388,   75,  405,  115,  422,   76,  439,  124,  456,   77,  473,  133,  490,   78,  507,  142,  524,   79,  541,  151,  558,   80, 65535,
	   272,  304,  273,  321,  274,  338,  275,  355,  276,  372,  277,  389,  278,  406,  279,  423,  280,  440,  281,  457,  282,  474,  283,  491,  284,  508,  285,  525,  286,  542,  287,  559,  288, 65535,
	     2,  305,   89,  322,   29,  339,   98,  356,   11,  373,  107,  390,   34,  407,  116,  424,    5,  441,  125,  458,   39,  475,  134,  492,   14,  509,  143,  526,   44,  543,  152,  560,    3, 65535,
	     0,  153,   45,  170,   15,  187,   54,  204,    6,  221,   63,  238,   20,  255,   72,  272,    2, 65535,
	   289,  290,  291,  292,  293,  294,  295,  296,  297,  298,  299,  300,  301,  302,  303,  304,  305, 65535,
	    81,  154,   82,  171,   83,  188,   84,  205,   85,  222,   86,  239,   87,  256,   88,  273,   89, 65535,
	   306,  307,  308,  309,  310,  311,  312,  313,  314,  315,  316,  317,  318,  319,  320,  321,  322, 65535,
	    25,  155,   46,  172,   26,  189,   55,  206,   27,  223,   64,  240,   28,  257,   73,  274,   29, 65535,
	   323,  324,  325,  326,  327,  328,  329,  330,  331,  332,  333,  334,  335,  336,  337,  338,  339, 65535,
	    90,  156,   91,  173,   92,  190,   93,  207,   94,  224,   95,  241,   96,  258,   97,  275,   98, 65535,
	   340,  341,  342,  343,  344,  345,  346,  347,  348,  349,  350,  351,  352,  353,  354,  355,  356, 65535,
	     9,  157,   47,  174,   16,  191,   56,  208,   10,  225,   65,  242,   21,  259,   74,  276,   11, 65535,
	   357,  358,  359,  360,  361,  362,  363,  364,  365,  366,  367,  368,  369,  370,  371,  372,  373, 65535,
	    99,  158,  100,  175,  101,  192,  102,  209,  103,  226,  104,  243,  105,  260,  106,  277,  107, 65535,
	   374,  375,  376,  377,  378,  379,  380,  381,  382,  383,  384,  385,  386,  387,  388,  389,  390, 65535,
	    30,  159,   48,  176,   31,  193,   57,  210,   32,  227,   66,  244,   33,  261,   75,  278,   34, 65535,
	   391,  392,  393,  394,  395,  396,  397,  398,  399,  400,  401,  402,  403,  404,  405,  406,  407, 65535,
	   108,  160,  109,  177,  110,  194,  111,  211,  112,  228,  113,  245,  114,  262,  115,  279,  116, 65535,
	   408,  409,  410,  411,  412,  413,  414,  415,  416,  417,  418,  419,  420,  421,  422,  423,  424, 65535,
	     4,  161,   49,  178,   17,  195,   58,  212,    7,  229,   67,  246,   22,  263,   76,  280,    5, 65535,
	   425,  426,  427,  428,  429,  430,  431,  432,  433,  434,  435,  436,  437,  438,  439,  440,  441, 65535,
	   117,  162,  118,  179,  119,  196,  120,  213,  121,  230,  122,  247,  123,  264,  124,  281,  125, 65535,
	   442,  443,  444,  445,  446,  447,  448,  449,  450,  451,  452,  453,  454,  455,  456,  457,  458, 65535,
	    35,  163,   50,  180,   36,  197,   59,  214,   37,  231,   68,  248,   38,  265,   77,  282,   39, 65535,
	   459,  460,  461,  462,  463,  464,  465,  466,  467,  468,  469,  470,  471,  472,  473,  474,  475, 65535,
	   126,  164,  127,  181,  128,  198,  129,  215,  130,  232,  131,  249,  132,  266,  133,  283,  134, 65535,
	   476,  477,  478,  479,  480,  481,  482,  483,  484,  485,  486,  487,  488,  489,  490,  491,  492, 65535,
	    12,  165,   51,  182,   18,  199,   60,  216,   13,  233,   69,  250,   23,  267,   78,  284,   14, 65535,
	   493,  494,  495,  496,  497,  498,  499,  500,  501,  502,  503,  504,  505,  506,  507,  508,  509, 65535,
	   135,  166,  136,  183,  137,  200,  138,  217,  139,  234,  140,  251,  141,  268,  142,  285,  143, 65535,
	   510,  511,  512,  513,  514,  515,  516,  517,  518,  519,  520,  521,  522,  523,  524,  525,  526, 65535,
	    40,  167,   52,  184,   41,  201,   61,  218,   42,  235,   70,  252,   43,  269,   79,  286,   44, 65535,
	   527,  528,  529,  530,  531,  532,  533,  534,  535,  536,  537,  538,  539,  540,  541,  542,  543, 65535,
	   144,  168,  145,  185,  146,  202,  147,  219,  148,  236,  149,  253,  150,  270,  151,  287,  152, 65535,
	   544,  545,  546,  547,  548,  549,  550,  551,  552,  553,  554,  555,  556,  557,  558,  559,  560, 65535,
	     1,  169,   53,  186,   19,  203,   62,  220,    8,  237,   71,  254,   24,  271,   80,  288,    3, 65535,
    ],
    tris: [
	     0,  153,  289,  290,   81,  154,  306,  307,   25,  155,  323,  324,   90,  156,  340,  341,    9,  157,  357,  358,   99,  158,  374,  375,   30,  159,  391,  392,  108,  160,  408,  409,    4,  161,  425,  426,  117,  162,  442,  443,   35,  163,  459,  460,  126,  164,  476,  477,   12,  165,  493,  494,  135,  166,  510,  511,   40,  167,  527,  528,  144,  168,  544,  545,    1,  169, 65535,
	   153,   45,  290,  291,  154,   82,  307,  308,  155,   46,  324,  325,  156,   91,  341,  342,  157,   47,  358,  359,  158,  100,  375,  376,  159,   48,  392,  393,  160,  109,  409,  410,  161,   49,  426,  427,  162,  118,  443,  444,  163,   50,  460,  461,  164,  127,  477,  478,  165,   51,  494,  495,  166,  136,  511,  512,  167,   52,  528,  529,  168,  145,  545,  546,  169,   53, 65535,
	    45,  170,  291,  292,   82,  171,  308,  309,   46,  172,  325,  326,   91,  173,  342,  343,   47,  174,  359,  360,  100,  175,  376,  377,   48,  176,  393,  394,  109,  177,  410,  411,   49,  178,  427,  428,  118,  179,  444,  445,   50,  180,  461,  462,  127,  181,  478,  479,   51,  182,  495,  496,  136,  183,  512,  513,   52,  184,  529,  530,  145,  185,  546,  547,   53,  186, 65535,
	   170,   15,  292,  293,  171,   83,  309,  310,  172,   26,  326,  327,  173,   92,  343,  344,  174,   16,  360,  361,  175,  101,  377,  378,  176,   31,  394,  395,  177,  110,  411,  412,  178,   17,  428,  429,  179,  119,  445,  446,  180,   36,  462,  463,  181,  128,  479,  480,  182,   18,  496,  497,  183,  137,  513,  514,  184,   41,  530,  531,  185,  146,  547,  548,  186,   19, 65535,
	    15,  187,  293,  294,   83,  188,  310,  311,   26,  189,  327,  328,   92,  190,  344,  345,   16,  191,  361,  362,  101,  192,  378,  379,   31,  193,  395,  396,  110,  194,  412,  413,   17,  195,  429,  430,  119,  196,  446,  447,   36,  197,  463,  464,  128,  198,  480,  481,   18,  199,  497,  498,  137,  200,  514,  515,   41,  201,  531,  532,  146,  202,  548,  549,   19,  203, 65535,
	   187,   54,  294,  295,  188,   84,  311,  312,  189,   55,  328,  329,  190,   93,  345,  346,  191,   56,  362,  363,  192,  102,  379,  380,  193,   57,  396,  397,  194,  111,  413,  414,  195,   58,  430,  431,  196,  120,  447,  448,  197,   59,  464,  465,  198,  129,  481,  482,  199,   60,  498,  499,  200,  138,  515,  516,  201,   61,  532,  533,  202,  147,  549,  550,  203,   62, 65535,
	    54,  204,  295,  296,   84,  205,  312,  313,   55,  206,  329,  330,   93,  207,  346,  347,   56,  208,  363,  364,  102,  209,  380,  381,   57,  210,  397,  398,  111,  211,  414,  415,   58,  212,  431,  432,  120,  213,  448,  449,   59,  214,  465,  466,  129,  215,  482,  483,   60,  216,  499,  500,  138,  217,  516,  517,   61,  218,  533,  534,  147,  219,  550,  551,   62,  220, 65535,
	   204,    6,  296,  297,  205,   85,  313,  314,  206,   27,  330,  331,  207,   94,  347,  348,  208,   10,  364,  365,  209,  103,  381,  382,  210,   32,  398,  399,  211,  112,  415,  416,  212,    7,  432,  433,  213,  121,  449,  450,  214,   37,  466,  467,  215,  130,  483,  484,  216,   13,  500,  501,  217,  139,  517,  518,  218,   42,  534,  535,  219,  148,  551,  552,  220,    8, 65535,
	     6,  221,  297,  298,   85,  222,  314,  315,   27,  223,  331,  332,   94,  224,  348,  349,   10,  225,  365,  366,  103,  226,  382,  383,   32,  227,  399,  400,  112,  228,  416,  417,    7,  229,  433,  434,  121,  230,  450,  451,   37,  231,  467,  468,  130,  232,  484,  485,   13,  233,  501,  502,  139,  234,  518,  519,   42,  235,  535,  536,  148,  236,  552,  553,    8,  237, 65535,
	   221,   63,  298,  299,  222,   86,  315,  316,  223,   64,  332,  333,  224,   95,  349,  350,  225,   65,  366,  367,  226,  104,  383,  384,  227,   66,  400,  401,  228,  113,  417,  418,  229,   67,  434,  435,  230,  122,  451,  452,  231,   68,  468,  469,  232,  131,  485,  486,  233,   69,  502,  503,  234,  140,  519,  520,  235,   70,  536,  537,  236,  149,  553,  554,  237,   71, 65535,
	    63,  238,  299,  300,   86,  239,  316,  317,   64,  240,  333,  334,   95,  241,  350,  351,   65,  242,  367,  368,  104,  243,  384,  385,   66,  244,  401,  402,  113,  245,  418,  419,   67,  246,  435,  436,  122,  247,  452,  453,   68,  248,  469,  470,  131,  249,  486,  487,   69,  250,  503,  504,  140,  251,  520,  521,   70,  252,  537,  538,  149,  253,  554,  555,   71,  254, 65535,
	   238,   20,  300,  301,  239,   87,  317,  318,  240,   28,  334,  335,  241,   96,  351,  352,  242,   21,  368,  369,  243,  105,  385,  386,  244,   33,  402,  403,  245,  114,  419,  420,  246,   22,  436,  437,  247,  123,  453,  454,  248,   38,  470,  471,  249,  132,  487,  488,  250,   23,  504,  505,  251,  141,  521,  522,  252,   43,  538,  539,  253,  150,  555,  556,  254,   24, 65535,
	    20,  255,  301,  302,   87,  256,  318,  319,   28,  257,  335,  336,   96,  258,  352,  353,   21,  259,  369,  370,  105,  260,  386,  387,   33,  261,  403,  404,  114,  262,  420,  421,   22,  263,  437,  438,  123,  264,  454,  455,   38,  265,  471,  472,  132,  266,  488,  489,   23,  267,  505,  506,  141,  268,  522,  523,   43,  269,  539,  540,  150,  270,  556,  557,   24,  271, 65535,
	   255,   72,  302,  303,  256,   88,  319,  320,  257,   73,  336,  337,  258,   97,  353,  354,  259,   74,  370,  371,  260,  106,  387,  388,  261,   75,  404,  405,  262,  115,  421,  422,  263,   76,  438,  439,  264,  124,  455,  456,  265,   77,  472,  473,  266,  133,  489,  490,  267,   78,  506,  507,  268,  142,  523,  524,  269,   79,  540,  541,  270,  151,  557,  558,  271,   80, 65535,
	    72,  272,  303,  304,   88,  273,  320,  321,   73,  274,  337,  338,   97,  275,  354,  355,   74,  276,  371,  372,  106,  277,  388,  389,   75,  278,  405,  406,  115,  279,  422,  423,   76,  280,  439,  440,  124,  281,  456,  457,   77,  282,  473,  474,  133,  283,  490,  491,   78,  284,  507,  508,  142,  285,  524,  525,   79,  286,  541,  542,  151,  287,  558,  559,   80,  288, 65535,
	   272,    2,  304,  305,  273,   89,  321,  322,  274,   29,  338,  339,  275,   98,  355,  356,  276,   11,  372,  373,  277,  107,  389,  390,  278,   34,  406,  407,  279,  116,  423,  424,  280,    5,  440,  441,  281,  125,  457,  458,  282,   39,  474,  475,  283,  134,  491,  492,  284,   14,  508,  509,  285,  143,  525,  526,  286,   44,  542,  543,  287,  152,  559,  560,  288,    3, 65535,
    ],
    w: 33,
    h: 17
  },
  {
    lines: [
	     0,  289,   81,  306,   25,  323,   90,  340,    9,  357,   99,  374,   30,  391,  108,  408,    4,  425,  117,  442,   35,  459,  126,  476,   12,  493,  135,  510,   40,  527,  144,  544,    1, 65535,
	   561,  562,  563,  564,  565,  566,  567,  568,  569,  570,  571,  572,  573,  574,  575,  576,  577,  578,  579,  580,  581,  582,  583,  584,  585,  586,  587,  588,  589,  590,  591,  592,  593, 65535,
	   153,  290,  154,  307,  155,  324,  156,  341,  157,  358,  158,  375,  159,  392,  160,  409,  161,  426,  162,  443,  163,  460,  164,  477,  165,  494,  166,  511,  167,  528,  168,  545,  169, 65535,
	   594,  595,  596,  597,  598,  599,  600,  601,  602,  603,  604,  605,  606,  607,  608,  609,  610,  611,  612,  613,  614,  615,  616,  617,  618,  619,  620,  621,  622,  623,  624,  625,  626, 65535,
	    45,  291,   82,  308,   46,  325,   91,  342,   47,  359,  100,  376,   48,  393,  109,  410,   49,  427,  118,  444,   50,  461,  127,  478,   51,  495,  136,  512,   52,  529,  145,  546,   53, 65535,
	   627,  628,  629,  630,  631,  632,  633,  634,  635,  636,  637,  638,  639,  640,  641,  642,  643,  644,  645,  646,  647,  648,  649,  650,  651,  652,  653,  654,  655,  656,  657,  658,  659, 65535,
	   170,  292,  171,  309,  172,  326,  173,  343,  174,  360,  175,  377,  176,  394,  177,  411,  178,  428,  179,  445,  180,  462,  181,  479,  182,  496,  183,  513,  184,  530,  185,  547,  186, 65535,
	   660,  661,  662,  663,  664,  665,  666,  667,  668,  669,  670,  671,  672,  673,  674,  675,  676,  677,  678,  679,  680,  681,  682,  683,  684,  685,  686,  687,  688,  689,  690,  691,  692, 65535,
	    15,  293,   83,  310,   26,  327,   92,  344,   16,  361,  101,  378,   31,  395,  110,  412,   17,  429,  119,  446,   36,  463,  128,  480,   18,  497,  137,  514,   41,  531,  146,  548,   19, 65535,
	   693,  694,  695,  696,  697,  698,  699,  700,  701,  702,  703,  704,  705,  706,  707,  708,  709,  710,  711,  712,  713,  714,  715,  716,  717,  718,  719,  720,  721,  722,  723,  724,  725, 65535,
	   187,  294,  188,  311,  189,  328,  190,  345,  191,  362,  192,  379,  193,  396,  194,  413,  195,  430,  196,  447,  197,  464,  198,  481,  199,  498,  200,  515,  201,  532,  202,  549,  203, 65535,
	   726,  727,  728,  729,  730,  731,  732,  733,  734,  735,  736,  737,  738,  739,  740,  741,  742,  743,  744,  745,  746,  747,  748,  749,  750,  751,  752,  753,  754,  755,  756,  757,  758, 65535,
	    54,  295,   84,  312,   55,  329,   93,  346,   56,  363,  102,  380,   57,  397,  111,  414,   58,  431,  120,  448,   59,  465,  129,  482,   60,  499,  138,  516,   61,  533,  147,  550,   62, 65535,
	   759,  760,  761,  762,  763,  764,  765,  766,  767,  768,  769,  770,  771,  772,  773,  774,  775,  776,  777,  778,  779,  780,  781,  782,  783,  784,  785,  786,  787,  788,  789,  790,  791, 65535,
	   204,  296,  205,  313,  206,  330,  207,  347,  208,  364,  209,  381,  210,  398,  211,  415,  212,  432,  213,  449,  214,  466,  215,  483,  216,  500,  217,  517,  218,  534,  219,  551,  220, 65535,
	   792,  793,  794,  795,  796,  797,  798,  799,  800,  801,  802,  803,  804,  805,  806,  807,  808,  809,  810,  811,  812,  813,  814,  815,  816,  817,  818,  819,  820,  821,  822,  823,  824, 65535,
	     6,  297,   85,  314,   27,  331,   94,  348,   10,  365,  103,  382,   32,  399,  112,  416,    7,  433,  121,  450,   37,  467,  130,  484,   13,  501,  139,  518,   42,  535,  148,  552,    8, 65535,
	   825,  826,  827,  828,  829,  830,  831,  832,  833,  834,  835,  836,  837,  838,  839,  840,  841,  842,  843,  844,  845,  846,  847,  848,  849,  850,  851,  852,  853,  854,  855,  856,  857, 65535,
	   221,  298,  222,  315,  223,  332,  224,  349,  225,  366,  226,  383,  227,  400,  228,  417,  229,  434,  230,  451,  231,  468,  232,  485,  233,  502,  234,  519,  235,  536,  236,  553,  237, 65535,
	   858,  859,  860,  861,  862,  863,  864,  865,  866,  867,  868,  869,  870,  871,  872,  873,  874,  875,  876,  877,  878,  879,  880,  881,  882,  883,  884,  885,  886,  887,  888,  889,  890, 65535,
	    63,  299,   86,  316,   64,  333,   95,  350,   65,  367,  104,  384,   66,  401,  113,  418,   67,  435,  122,  452,   68,  469,  131,  486,   69,  503,  140,  520,   70,  537,  149,  554,   71, 65535,
	   891,  892,  893,  894,  895,  896,  897,  898,  899,  900,  901,  902,  903,  904,  905,  906,  907,  908,  909,  910,  911,  912,  913,  914,  915,  916,  917,  918,  919,  920,  921,  922,  923, 65535,
	   238,  300,  239,  317,  240,  334,  241,  351,  242,  368,  243,  385,  244,  402,  245,  419,  246,  436,  247,  453,  248,  470,  249,  487,  250,  504,  251,  521,  252,  538,  253,  555,  254, 65535,
	   924,  925,  926,  927,  928,  929,  930,  931,  932,  933,  934,  935,  936,  937,  938,  939,  940,  941,  942,  943,  944,  945,  946,  947,  948,  949,  950,  951,  952,  953,  954,  955,  956, 65535,
	    20,  301,   87,  318,   28,  335,   96,  352,   21,  369,  105,  386,   33,  403,  114,  420,   22,  437,  123,  454,   38,  471,  132,  488,   23,  505,  141,  522,   43,  539,  150,  556,   24, 65535,
	   957,  958,  959,  960,  961,  962,  963,  964,  965,  966,  967,  968,  969,  970,  971,  972,  973,  974,  975,  976,  977,  978,  979,  980,  981,  982,  983,  984,  985,  986,  987,  988,  989, 65535,
	   255,  302,  256,  319,  257,  336,  258,  353,  259,  370,  260,  387,  261,  404,  262,  421,  263,  438,  264,  455,  265,  472,  266,  489,  267,  506,  268,  523,  269,  540,  270,  557,  271, 65535,
	   990,  991,  992,  993,  994,  995,  996,  997,  998,  999, 1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 65535,
	    72,  303,   88,  320,   73,  337,   97,  354,   74,  371,  106,  388,   75,  405,  115,  422,   76,  439,  124,  456,   77,  473,  133,  490,   78,  507,  142,  524,   79,  541,  151,  558,   80, 65535,
	  1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 65535,
	   272,  304,  273,  321,  274,  338,  275,  355,  276,  372,  277,  389,  278,  406,  279,  423,  280,  440,  281,  457,  282,  474,  283,  491,  284,  508,  285,  525,  286,  542,  287,  559,  288, 65535,
	  1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 65535,
	     2,  305,   89,  322,   29,  339,   98,  356,   11,  373,  107,  390,   34,  407,  116,  424,    5,  441,  125,  458,   39,  475,  134,  492,   14,  509,  143,  526,   44,  543,  152,  560,    3, 65535,
	     0,  561,  153,  594,   45,  627,  170,  660,   15,  693,  187,  726,   54,  759,  204,  792,    6,  825,  221,  858,   63,  891,  238,  924,   20,  957,  255,  990,   72, 1023,  272, 1056,    2, 65535,
	   289,  562,  290,  595,  291,  628,  292,  661,  293,  694,  294,  727,  295,  760,  296,  793,  297,  826,  298,  859,  299,  892,  300,  925,  301,  958,  302,  991,  303, 1024,  304, 1057,  305, 65535,
	    81,  563,  154,  596,   82,  629,  171,  662,   83,  695,  188,  728,   84,  761,  205,  794,   85,  827,  222,  860,   86,  893,  239,  926,   87,  959,  256,  992,   88, 1025,  273, 1058,   89, 65535,
	   306,  564,  307,  597,  308,  630,  309,  663,  310,  696,  311,  729,  312,  762,  313,  795,  314,  828,  315,  861,  316,  894,  317,  927,  318,  960,  319,  993,  320, 1026,  321, 1059,  322, 65535,
	    25,  565,  155,  598,   46,  631,  172,  664,   26,  697,  189,  730,   55,  763,  206,  796,   27,  829,  223,  862,   64,  895,  240,  928,   28,  961,  257,  994,   73, 1027,  274, 1060,   29, 65535,
	   323,  566,  324,  599,  325,  632,  326,  665,  327,  698,  328,  731,  329,  764,  330,  797,  331,  830,  332,  863,  333,  896,  334,  929,  335,  962,  336,  995,  337, 1028,  338, 1061,  339, 65535,
	    90,  567,  156,  600,   91,  633,  173,  666,   92,  699,  190,  732,   93,  765,  207,  798,   94,  831,  224,  864,   95,  897,  241,  930,   96,  963,  258,  996,   97, 1029,  275, 1062,   98, 65535,
	   340,  568,  341,  601,  342,  634,  343,  667,  344,  700,  345,  733,  346,  766,  347,  799,  348,  832,  349,  865,  350,  898,  351,  931,  352,  964,  353,  997,  354, 1030,  355, 1063,  356, 65535,
	     9,  569,  157,  602,   47,  635,  174,  668,   16,  701,  191,  734,   56,  767,  208,  800,   10,  833,  225,  866,   65,  899,  242,  932,   21,  965,  259,  998,   74, 1031,  276, 1064,   11, 65535,
	   357,  570,  358,  603,  359,  636,  360,  669,  361,  702,  362,  735,  363,  768,  364,  801,  365,  834,  366,  867,  367,  900,  368,  933,  369,  966,  370,  999,  371, 1032,  372, 1065,  373, 65535,
	    99,  571,  158,  604,  100,  637,  175,  670,  101,  703,  192,  736,  102,  769,  209,  802,  103,  835,  226,  868,  104,  901,  243,  934,  105,  967,  260, 1000,  106, 1033,  277, 1066,  107, 65535,
	   374,  572,  375,  605,  376,  638,  377,  671,  378,  704,  379,  737,  380,  770,  381,  803,  382,  836,  383,  869,  384,  902,  385,  935,  386,  968,  387, 1001,  388, 1034,  389, 1067,  390, 65535,
	    30,  573,  159,  606,   48,  639,  176,  672,   31,  705,  193,  738,   57,  771,  210,  804,   32,  837,  227,  870,   66,  903,  244,  936,   33,  969,  261, 1002,   75, 1035,  278, 1068,   34, 65535,
	   391,  574,  392,  607,  393,  640,  394,  673,  395,  706,  396,  739,  397,  772,  398,  805,  399,  838,  400,  871,  401,  904,  402,  937,  403,  970,  404, 1003,  405, 1036,  406, 1069,  407, 65535,
	   108,  575,  160,  608,  109,  641,  177,  674,  110,  707,  194,  740,  111,  773,  211,  806,  112,  839,  228,  872,  113,  905,  245,  938,  114,  971,  262, 1004,  115, 1037,  279, 1070,  116, 65535,
	   408,  576,  409,  609,  410,  642,  411,  675,  412,  708,  413,  741,  414,  774,  415,  807,  416,  840,  417,  873,  418,  906,  419,  939,  420,  972,  421, 1005,  422, 1038,  423, 1071,  424, 65535,
	     4,  577,  161,  610,   49,  643,  178,  676,   17,  709,  195,  742,   58,  775,  212,  808,    7,  841,  229,  874,   67,  907,  246,  940,   22,  973,  263, 1006,   76, 1039,  280, 1072,    5, 65535,
	   425,  578,  426,  611,  427,  644,  428,  677,  429,  710,  430,  743,  431,  776,  432,  809,  433,  842,  434,  875,  435,  908,  436,  941,  437,  974,  438, 1007,  439, 1040,  440, 1073,  441, 65535,
	   117,  579,  162,  612,  118,  645,  179,  678,  119,  711,  196,  744,  120,  777,  213,  810,  121,  843,  230,  876,  122,  909,  247,  942,  123,  975,  264, 1008,  124, 1041,  281, 1074,  125, 65535,
	   442,  580,  443,  613,  444,  646,  445,  679,  446,  712,  447,  745,  448,  778,  449,  811,  450,  844,  451,  877,  452,  910,  453,  943,  454,  976,  455, 1009,  456, 1042,  457, 1075,  458, 65535,
	    35,  581,  163,  614,   50,  647,  180,  680,   36,  713,  197,  746,   59,  779,  214,  812,   37,  845,  231,  878,   68,  911,  248,  944,   38,  977,  265, 1010,   77, 1043,  282, 1076,   39, 65535,
	   459,  582,  460,  615,  461,  648,  462,  681,  463,  714,  464,  747,  465,  780,  466,  813,  467,  846,  468,  879,  469,  912,  470,  945,  471,  978,  472, 1011,  473, 1044,  474, 1077,  475, 65535,
	   126,  583,  164,  616,  127,  649,  181,  682,  128,  715,  198,  748,  129,  781,  215,  814,  130,  847,  232,  880,  131,  913,  249,  946,  132,  979,  266, 1012,  133, 1045,  283, 1078,  134, 65535,
	   476,  584,  477,  617,  478,  650,  479,  683,  480,  716,  481,  749,  482,  782,  483,  815,  484,  848,  485,  881,  486,  914,  487,  947,  488,  980,  489, 1013,  490, 1046,  491, 1079,  492, 65535,
	    12,  585,  165,  618,   51,  651,  182,  684,   18,  717,  199,  750,   60,  783,  216,  816,   13,  849,  233,  882,   69,  915,  250,  948,   23,  981,  267, 1014,   78, 1047,  284, 1080,   14, 65535,
	   493,  586,  494,  619,  495,  652,  496,  685,  497,  718,  498,  751,  499,  784,  500,  817,  501,  850,  502,  883,  503,  916,  504,  949,  505,  982,  506, 1015,  507, 1048,  508, 1081,  509, 65535,
	   135,  587,  166,  620,  136,  653,  183,  686,  137,  719,  200,  752,  138,  785,  217,  818,  139,  851,  234,  884,  140,  917,  251,  950,  141,  983,  268, 1016,  142, 1049,  285, 1082,  143, 65535,
	   510,  588,  511,  621,  512,  654,  513,  687,  514,  720,  515,  753,  516,  786,  517,  819,  518,  852,  519,  885,  520,  918,  521,  951,  522,  984,  523, 1017,  524, 1050,  525, 1083,  526, 65535,
	    40,  589,  167,  622,   52,  655,  184,  688,   41,  721,  201,  754,   61,  787,  218,  820,   42,  853,  235,  886,   70,  919,  252,  952,   43,  985,  269, 1018,   79, 1051,  286, 1084,   44, 65535,
	   527,  590,  528,  623,  529,  656,  530,  689,  531,  722,  532,  755,  533,  788,  534,  821,  535,  854,  536,  887,  537,  920,  538,  953,  539,  986,  540, 1019,  541, 1052,  542, 1085,  543, 65535,
	   144,  591,  168,  624,  145,  657,  185,  690,  146,  723,  202,  756,  147,  789,  219,  822,  148,  855,  236,  888,  149,  921,  253,  954,  150,  987,  270, 1020,  151, 1053,  287, 1086,  152, 65535,
	   544,  592,  545,  625,  546,  658,  547,  691,  548,  724,  549,  757,  550,  790,  551,  823,  552,  856,  553,  889,  554,  922,  555,  955,  556,  988,  557, 1021,  558, 1054,  559, 1087,  560, 65535,
	     1,  593,  169,  626,   53,  659,  186,  692,   19,  725,  203,  758,   62,  791,  220,  824,    8,  857,  237,  890,   71,  923,  254,  956,   24,  989,  271, 1022,   80, 1055,  288, 1088,    3, 65535,
    ],
    tris: [
	     0,  561,  289,  562,   81,  563,  306,  564,   25,  565,  323,  566,   90,  567,  340,  568,    9,  569,  357,  570,   99,  571,  374,  572,   30,  573,  391,  574,  108,  575,  408,  576,    4,  577,  425,  578,  117,  579,  442,  580,   35,  581,  459,  582,  126,  583,  476,  584,   12,  585,  493,  586,  135,  587,  510,  588,   40,  589,  527,  590,  144,  591,  544,  592,    1,  593, 65535,
	   561,  153,  562,  290,  563,  154,  564,  307,  565,  155,  566,  324,  567,  156,  568,  341,  569,  157,  570,  358,  571,  158,  572,  375,  573,  159,  574,  392,  575,  160,  576,  409,  577,  161,  578,  426,  579,  162,  580,  443,  581,  163,  582,  460,  583,  164,  584,  477,  585,  165,  586,  494,  587,  166,  588,  511,  589,  167,  590,  528,  591,  168,  592,  545,  593,  169, 65535,
	   153,  594,  290,  595,  154,  596,  307,  597,  155,  598,  324,  599,  156,  600,  341,  601,  157,  602,  358,  603,  158,  604,  375,  605,  159,  606,  392,  607,  160,  608,  409,  609,  161,  610,  426,  611,  162,  612,  443,  613,  163,  614,  460,  615,  164,  616,  477,  617,  165,  618,  494,  619,  166,  620,  511,  621,  167,  622,  528,  623,  168,  624,  545,  625,  169,  626, 65535,
	   594,   45,  595,  291,  596,   82,  597,  308,  598,   46,  599,  325,  600,   91,  601,  342,  602,   47,  603,  359,  604,  100,  605,  376,  606,   48,  607,  393,  608,  109,  609,  410,  610,   49,  611,  427,  612,  118,  613,  444,  614,   50,  615,  461,  616,  127,  617,  478,  618,   51,  619,  495,  620,  136,  621,  512,  622,   52,  623,  529,  624,  145,  625,  546,  626,   53, 65535,
	    45,  627,  291,  628,   82,  629,  308,  630,   46,  631,  325,  632,   91,  633,  342,  634,   47,  635,  359,  636,  100,  637,  376,  638,   48,  639,  393,  640,  109,  641,  410,  642,   49,  643,  427,  644,  118,  645,  444,  646,   50,  647,  461,  648,  127,  649,  478,  650,   51,  651,  495,  652,  136,  653,  512,  654,   52,  655,  529,  656,  145,  657,  546,  658,   53,  659, 65535,
	   627,  170,  628,  292,  629,  171,  630,  309,  631,  172,  632,  326,  633,  173,  634,  343,  635,  174,  636,  360,  637,  175,  638,  377,  639,  176,  640,  394,  641,  177,  642,  411,  643,  178,  644,  428,  645,  179,  646,  445,  647,  180,  648,  462,  649,  181,  650,  479,  651,  182,  652,  496,  653,  183,  654,  513,  655,  184,  656,  530,  657,  185,  658,  547,  659,  186, 65535,
	   170,  660,  292,  661,  171,  662,  309,  663,  172,  664,  326,  665,  173,  666,  343,  667,  174,  668,  360,  669,  175,  670,  377,  671,  176,  672,  394,  673,  177,  674,  411,  675,  178,  676,  428,  677,  179,  678,  445,  679,  180,  680,  462,  681,  181,  682,  479,  683,  182,  684,  496,  685,  183,  686,  513,  687,  184,  688,  530,  689,  185,  690,  547,  691,  186,  692, 65535,
	   660,   15,  661,  293,  662,   83,  663,  310,  664,   26,  665,  327,  666,   92,  667,  344,  668,   16,  669,  361,  670,  101,  671,  378,  672,   31,  673,  395,  674,  110,  675,  412,  676,   17,  677,  429,  678,  119,  679,  446,  680,   36,  681,  463,  682,  128,  683,  480,  684,   18,  685,  497,  686,  137,  687,  514,  688,   41,  689,  531,  690,  146,  691,  548,  692,   19, 65535,
	    15,  693,  293,  694,   83,  695,  310,  696,   26,  697,  327,  698,   92,  699,  344,  700,   16,  701,  361,  702,  101,  703,  378,  704,   31,  705,  395,  706,  110,  707,  412,  708,   17,  709,  429,  710,  119,  711,  446,  712,   36,  713,  463,  714,  128,  715,  480,  716,   18,  717,  497,  718,  137,  719,  514,  720,   41,  721,  531,  722,  146,  723,  548,  724,   19,  725, 65535,
	   693,  187,  694,  294,  695,  188,  696,  311,  697,  189,  698,  328,  699,  190,  700,  345,  701,  191,  702,  362,  703,  192,  704,  379,  705,  193,  706,  396,  707,  194,  708,  413,  709,  195,  710,  430,  711,  196,  712,  447,  713,  197,  714,  464,  715,  198,  716,  481,  717,  199,  718,  498,  719,  200,  720,  515,  721,  201,  722,  532,  723,  202,  724,  549,  725,  203, 65535,
	   187,  726,  294,  727,  188,  728,  311,  729,  189,  730,  328,  731,  190,  732,  345,  733,  191,  734,  362,  735,  192,  736,  379,  737,  193,  738,  396,  739,  194,  740,  413,  741,  195,  742,  430,  743,  196,  744,  447,  745,  197,  746,  464,  747,  198,  748,  481,  749,  199,  750,  498,  751,  200,  752,  515,  753,  201,  754,  532,  755,  202,  756,  549,  757,  203,  758, 65535,
	   726,   54,  727,  295,  728,   84,  729,  312,  730,   55,  731,  329,  732,   93,  733,  346,  734,   56,  735,  363,  736,  102,  737,  380,  738,   57,  739,  397,  740,  111,  741,  414,  742,   58,  743,  431,  744,  120,  745,  448,  746,   59,  747,  465,  748,  129,  749,  482,  750,   60,  751,  499,  752,  138,  753,  516,  754,   61,  755,  533,  756,  147,  757,  550,  758,   62, 65535,
	    54,  759,  295,  760,   84,  761,  312,  762,   55,  763,  329,  764,   93,  765,  346,  766,   56,  767,  363,  768,  102,  769,  380,  770,   57,  771,  397,  772,  111,  773,  414,  774,   58,  775,  431,  776,  120,  777,  448,  778,   59,  779,  465,  780,  129,  781,  482,  782,   60,  783,  499,  784,  138,  785,  516,  786,   61,  787,  533,  788,  147,  789,  550,  790,   62,  791, 65535,
	   759,  204,  760,  296,  761,  205,  762,  313,  763,  206,  764,  330,  765,  207,  766,  347,  767,  208,  768,  364,  769,  209,  770,  381,  771,  210,  772,  398,  773,  211,  774,  415,  775,  212,  776,  432,  777,  213,  778,  449,  779,  214,  780,  466,  781,  215,  782,  483,  783,  216,  784,  500,  785,  217,  786,  517,  787,  218,  788,  534,  789,  219,  790,  551,  791,  220, 65535,
	   204,  792,  296,  793,  205,  794,  313,  795,  206,  796,  330,  797,  207,  798,  347,  799,  208,  800,  364,  801,  209,  802,  381,  803,  210,  804,  398,  805,  211,  806,  415,  807,  212,  808,  432,  809,  213,  810,  449,  811,  214,  812,  466,  813,  215,  814,  483,  815,  216,  816,  500,  817,  217,  818,  517,  819,  218,  820,  534,  821,  219,  822,  551,  823,  220,  824, 65535,
	   792,    6,  793,  297,  794,   85,  795,  314,  796,   27,  797,  331,  798,   94,  799,  348,  800,   10,  801,  365,  802,  103,  803,  382,  804,   32,  805,  399,  806,  112,  807,  416,  808,    7,  809,  433,  810,  121,  811,  450,  812,   37,  813,  467,  814,  130,  815,  484,  816,   13,  817,  501,  818,  139,  819,  518,  820,   42,  821,  535,  822,  148,  823,  552,  824,    8, 65535,
	     6,  825,  297,  826,   85,  827,  314,  828,   27,  829,  331,  830,   94,  831,  348,  832,   10,  833,  365,  834,  103,  835,  382,  836,   32,  837,  399,  838,  112,  839,  416,  840,    7,  841,  433,  842,  121,  843,  450,  844,   37,  845,  467,  846,  130,  847,  484,  848,   13,  849,  501,  850,  139,  851,  518,  852,   42,  853,  535,  854,  148,  855,  552,  856,    8,  857, 65535,
	   825,  221,  826,  298,  827,  222,  828,  315,  829,  223,  830,  332,  831,  224,  832,  349,  833,  225,  834,  366,  835,  226,  836,  383,  837,  227,  838,  400,  839,  228,  840,  417,  841,  229,  842,  434,  843,  230,  844,  451,  845,  231,  846,  468,  847,  232,  848,  485,  849,  233,  850,  502,  851,  234,  852,  519,  853,  235,  854,  536,  855,  236,  856,  553,  857,  237, 65535,
	   221,  858,  298,  859,  222,  860,  315,  861,  223,  862,  332,  863,  224,  864,  349,  865,  225,  866,  366,  867,  226,  868,  383,  869,  227,  870,  400,  871,  228,  872,  417,  873,  229,  874,  434,  875,  230,  876,  451,  877,  231,  878,  468,  879,  232,  880,  485,  881,  233,  882,  502,  883,  234,  884,  519,  885,  235,  886,  536,  887,  236,  888,  553,  889,  237,  890, 65535,
	   858,   63,  859,  299,  860,   86,  861,  316,  862,   64,  863,  333,  864,   95,  865,  350,  866,   65,  867,  367,  868,  104,  869,  384,  870,   66,  871,  401,  872,  113,  873,  418,  874,   67,  875,  435,  876,  122,  877,  452,  878,   68,  879,  469,  880,  131,  881,  486,  882,   69,  883,  503,  884,  140,  885,  520,  886,   70,  887,  537,  888,  149,  889,  554,  890,   71, 65535,
	    63,  891,  299,  892,   86,  893,  316,  894,   64,  895,  333,  896,   95,  897,  350,  898,   65,  899,  367,  900,  104,  901,  384,  902,   66,  903,  401,  904,  113,  905,  418,  906,   67,  907,  435,  908,  122,  909,  452,  910,   68,  911,  469,  912,  131,  913,  486,  914,   69,  915,  503,  916,  140,  917,  520,  918,   70,  919,  537,  920,  149,  921,  554,  922,   71,  923, 65535,
	   891,  238,  892,  300,  893,  239,  894,  317,  895,  240,  896,  334,  897,  241,  898,  351,  899,  242,  900,  368,  901,  243,  902,  385,  903,  244,  904,  402,  905,  245,  906,  419,  907,  246,  908,  436,  909,  247,  910,  453,  911,  248,  912,  470,  913,  249,  914,  487,  915,  250,  916,  504,  917,  251,  918,  521,  919,  252,  920,  538,  921,  253,  922,  555,  923,  254, 65535,
	   238,  924,  300,  925,  239,  926,  317,  927,  240,  928,  334,  929,  241,  930,  351,  931,  242,  932,  368,  933,  243,  934,  385,  935,  244,  936,  402,  937,  245,  938,  419,  939,  246,  940,  436,  941,  247,  942,  453,  943,  248,  944,  470,  945,  249,  946,  487,  947,  250,  948,  504,  949,  251,  950,  521,  951,  252,  952,  538,  953,  253,  954,  555,  955,  254,  956, 65535,
	   924,   20,  925,  301,  926,   87,  927,  318,  928,   28,  929,  335,  930,   96,  931,  352,  932,   21,  933,  369,  934,  105,  935,  386,  936,   33,  937,  403,  938,  114,  939,  420,  940,   22,  941,  437,  942,  123,  943,  454,  944,   38,  945,  471,  946,  132,  947,  488,  948,   23,  949,  505,  950,  141,  951,  522,  952,   43,  953,  539,  954,  150,  955,  556,  956,   24, 65535,
	    20,  957,  301,  958,   87,  959,  318,  960,   28,  961,  335,  962,   96,  963,  352,  964,   21,  965,  369,  966,  105,  967,  386,  968,   33,  969,  403,  970,  114,  971,  420,  972,   22,  973,  437,  974,  123,  975,  454,  976,   38,  977,  471,  978,  132,  979,  488,  980,   23,  981,  505,  982,  141,  983,  522,  984,   43,  985,  539,  986,  150,  987,  556,  988,   24,  989, 65535,
	   957,  255,  958,  302,  959,  256,  960,  319,  961,  257,  962,  336,  963,  258,  964,  353,  965,  259,  966,  370,  967,  260,  968,  387,  969,  261,  970,  404,  971,  262,  972,  421,  973,  263,  974,  438,  975,  264,  976,  455,  977,  265,  978,  472,  979,  266,  980,  489,  981,  267,  982,  506,  983,  268,  984,  523,  985,  269,  986,  540,  987,  270,  988,  557,  989,  271, 65535,
	   255,  990,  302,  991,  256,  992,  319,  993,  257,  994,  336,  995,  258,  996,  353,  997,  259,  998,  370,  999,  260, 1000,  387, 1001,  261, 1002,  404, 1003,  262, 1004,  421, 1005,  263, 1006,  438, 1007,  264, 1008,  455, 1009,  265, 1010,  472, 1011,  266, 1012,  489, 1013,  267, 1014,  506, 1015,  268, 1016,  523, 1017,  269, 1018,  540, 1019,  270, 1020,  557, 1021,  271, 1022, 65535,
	   990,   72,  991,  303,  992,   88,  993,  320,  994,   73,  995,  337,  996,   97,  997,  354,  998,   74,  999,  371, 1000,  106, 1001,  388, 1002,   75, 1003,  405, 1004,  115, 1005,  422, 1006,   76, 1007,  439, 1008,  124, 1009,  456, 1010,   77, 1011,  473, 1012,  133, 1013,  490, 1014,   78, 1015,  507, 1016,  142, 1017,  524, 1018,   79, 1019,  541, 1020,  151, 1021,  558, 1022,   80, 65535,
	    72, 1023,  303, 1024,   88, 1025,  320, 1026,   73, 1027,  337, 1028,   97, 1029,  354, 1030,   74, 1031,  371, 1032,  106, 1033,  388, 1034,   75, 1035,  405, 1036,  115, 1037,  422, 1038,   76, 1039,  439, 1040,  124, 1041,  456, 1042,   77, 1043,  473, 1044,  133, 1045,  490, 1046,   78, 1047,  507, 1048,  142, 1049,  524, 1050,   79, 1051,  541, 1052,  151, 1053,  558, 1054,   80, 1055, 65535,
	  1023,  272, 1024,  304, 1025,  273, 1026,  321, 1027,  274, 1028,  338, 1029,  275, 1030,  355, 1031,  276, 1032,  372, 1033,  277, 1034,  389, 1035,  278, 1036,  406, 1037,  279, 1038,  423, 1039,  280, 1040,  440, 1041,  281, 1042,  457, 1043,  282, 1044,  474, 1045,  283, 1046,  491, 1047,  284, 1048,  508, 1049,  285, 1050,  525, 1051,  286, 1052,  542, 1053,  287, 1054,  559, 1055,  288, 65535,
	   272, 1056,  304, 1057,  273, 1058,  321, 1059,  274, 1060,  338, 1061,  275, 1062,  355, 1063,  276, 1064,  372, 1065,  277, 1066,  389, 1067,  278, 1068,  406, 1069,  279, 1070,  423, 1071,  280, 1072,  440, 1073,  281, 1074,  457, 1075,  282, 1076,  474, 1077,  283, 1078,  491, 1079,  284, 1080,  508, 1081,  285, 1082,  525, 1083,  286, 1084,  542, 1085,  287, 1086,  559, 1087,  288, 1088, 65535,
	  1056,    2, 1057,  305, 1058,   89, 1059,  322, 1060,   29, 1061,  339, 1062,   98, 1063,  356, 1064,   11, 1065,  373, 1066,  107, 1067,  390, 1068,   34, 1069,  407, 1070,  116, 1071,  424, 1072,    5, 1073,  441, 1074,  125, 1075,  458, 1076,   39, 1077,  475, 1078,  134, 1079,  492, 1080,   14, 1081,  509, 1082,  143, 1083,  526, 1084,   44, 1085,  543, 1086,  152, 1087,  560, 1088,    3, 65535,
    ],
    w: 33,
    h: 33
  },
];

/* test usage */

function demo() {
  var plot = null;
  var mouse_down = false;
  var mouse_x = 0;
  var mouse_y = 0;
  var old_src = "";
  
  function init() {
    var c  = document.getElementById('demo');
    var w  = c.width;
    var h  = c.height;
    var gl = c.getContext('experimental-webgl');
    if (!gl) {
      alert('could not create webgl context!');
    }

    var bg = {r: 0.1, g: 0.1, b: 0.1};
    var fg_re = [{r: 0.2, g: 0.2, b: 0.7}, {r: 0.2, g: 0.7, b: 0.1}];
    var fg_im = [{r: 0.6, g: 0.2, b: 0.2}, {r: 0.6, g: 0.4, b: 0.2}];
    plot = new Plot3D(gl, w, h, bg, fg_re, fg_im);
  
    c.addEventListener('mousedown', mousedown);
    c.addEventListener('mousemove', mousemove);
    c.addEventListener('mouseup', mouseup);

    var e = document.getElementById('input');
    input.addEventListener('keyup', keyup);
  }
  
  function keyup(ev) {
    var src = this.value;
    if (src == old_src) return;
    old_src = src;
    
    var str = "";
    var context = new Context(src);
    if (context.err != null) {
      str = context.err;
    } else {
      str += "Interpreted as: ";
      str += context.toString();
      //var result = context.array(-1.0, 1.0, -1.0, 1.0, 16);
      //str += "[ " + result.join(", ") + " ]";
      plot.update(context);
      plot.draw();
    }
    
    var display = document.getElementById("token_display");
    display.innerHTML = str;
  }

  function mousedown(ev) {
    mouse_down = true;
    mouse_x = ev.pageX - this.offsetLeft;
    mouse_y = ev.pageY - this.offsetTop;
  }

  function mousemove(ev) {
    if (!mouse_down) return;
    var x = ev.pageX - this.offsetLeft;
    var y = ev.pageY - this.offsetTop;

    var dx = x - mouse_x;
    var dy = y - mouse_y;

    mouse_x = x;
    mouse_y = y;

    var scale = Math.PI / 400.0;
    var rot = new Vec3(-dy * scale, -dx * scale, 0.0);
    plot.rotate(rot);
    plot.draw();
  }

  function mouseup(ev) {
    mouse_down = false;
    var x = ev.pageX - this.offsetLeft;
    var y = ev.pageY - this.offsetTop;

    plot.draw();
  }

  init();
}
