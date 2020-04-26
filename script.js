let classNameSections = document.querySelector(".name_sections");
let btnCountinue = document.getElementById("continue");
let classNumberCriterions = document.getElementsByClassName(
  "number_criterions"
);
let classDescribeSection = document.getElementsByClassName("describe_section");
let tableSpace = document.getElementById("tableSpace");
let start = document.getElementById("start");
let algorithm = document.getElementById("algorithm");
let info = document.getElementById("info");
let info2 = document.getElementById("info2");
let numberCriterion;

btnCountinue.onclick = function () {
  numberCriterion = document.getElementById("number_criterion").value;
  if (!numberCriterion) {
    return false;
  }

  classNumberCriterions[0].style.display = "none";
  classNameSections.style.display = "inline";

  let criterionsHtml = "<p>Name of criterions:</p>";
  for (let i = 0; i < numberCriterion; i++) {
    criterionsHtml =
      criterionsHtml +
      '<div class="criterion_describe"><input class="inputs" id="name_criterion' +
      i +
      '"></div>';
  }
  criterionsHtml =
    criterionsHtml +
    '<br><button id="saveNames">Save</button>' +
    '<button id="start">Start</button>';
  classNameSections.innerHTML = criterionsHtml;
};

let arrayValueInput;
$("body").on("click", "#saveNames", function () {
  arrayValueInput = new Array();

  for (let i = 0; i < numberCriterion; i++) {
    let val = document.getElementById("name_criterion" + i).value;
    arrayValueInput[i] = val;
  }
  console.log(arrayValueInput);
});

$("body").on("click", "#start", function () {
  classNameSections.style.display = "none";
  algorithm.style.display = "inline";

  main(Number(numberCriterion), arrayValueInput);
});

var creatingTable;
let tableID = 0;
function createTable(fbs) {
  creatingTable = `<table id="table${tableID}"><tboby><tr></tr></tbody></table>`;
  tableSpace.innerHTML = creatingTable;
  tableID++;
}

var printingTable;
function printTable(fbs, compMatr) {
  var table = Array.from(Array(fbs.length + 1), () =>
    new Array(fbs.length + 1).fill("")
  );
  table[0][0] = "";
  for (let i = 1; i < fbs.length + 1; i++) {
    table[0][i] = fbs[i - 1].join("");
    table[i][0] = fbs[i - 1].join("");
  }

  for (let i = 1; i < compMatr.length + 1; i++) {
    for (let j = 1; j < compMatr.length + 1; j++) {
      if (compMatr[j - 1][i - 1] != -1) {
        table[i][j] = compMatr[j - 1][i - 1];
      }
    }
  }

  let tbody = document
    .getElementById(`table` + (tableID - 1))
    .getElementsByTagName("tbody")[0];

  for (let i = 0; i < fbs.length + 1; i++) {
    let row = document.createElement("TR");
    printingTable += "<tr>";
    for (let j = 0; j < fbs.length + 1; j++) {
      let td0 = document.createElement("TD");
      td0.appendChild(document.createTextNode(table[j][i]));
      printingTable += "<th>" + table[j][i] + "</th>";
      tbody.appendChild(row);
      row.appendChild(td0);
    }
    printingTable += "</tr>";
  }
  printingTable += "</tbody></table><br><br>";
}

var I = 0;
var J = 0;
var vectors;
var fbs;
var compMatr;
var mtr;
function main(N, nameInputs) {
  vectors = new Array(nameInputs.length);
  for (let i = 0; i < nameInputs.length; i++) {
    vectors[i] = new Array(nameInputs[i].length);
    for (let j = 0; j < nameInputs[i].length; j++) {
      vectors[i][j] = Number(nameInputs[i][j]);
    }
  }
  fbs = firstBaseSit(N);

  let varietyFirstSituation =
    "The first situation of variety of alternatives: ";
  for (let i = 0; i < arrayValueInput.length; i++) {
    varietyFirstSituation += arrayValueInput[i] + " ";
  }
  info.innerHTML = varietyFirstSituation;

  compMatr = Array.from(Array(fbs.length), () =>
    new Array(fbs.length).fill(-1)
  );
  mtr = Array.from(Array(fbs.length), () => new Array(fbs.length + 1).fill(0));
  for (let i = 0; i < fbs.length; i++) {
    compMatr[i][i] = 2;
    mtr[i][i] = -1;
    for (let j = i + 1; j < fbs.length; j++) {
      compMatr[i][j] = 0;
      if (compAlts(fbs[i], fbs[j]) > 0) {
        compMatr[i][j] = 1;
        mtr[i][j] = 1;
        mtr[i][fbs.length]++;
      }
    }
  }

  createTable(fbs);
  printTable(fbs, compMatr);
  ask();
}

function ask() {
  let asking;
  outterLoop: for (let i = 0; i < fbs.length; ++i) {
    for (let j = i + 1; j < fbs.length; j++) {
      if (compMatr[i][j] == 0) {
        asking = `\nVector ${fbs[i].join("")} better than vector ${fbs[j].join(
          ""
        )}? <input type="checkbox" id="choose"> <button id="next">Continue</button>`;
        info2.innerHTML = asking;
        I = i;
        J = j;
        return;
      }
    }
  }

  let N = Number(numberCriterion);
  let print = `<br>`;
  let sortFBS = Array.from(Array(fbs.length),() => new Array());
  for (let i = 0; i < fbs.length; ++i) {
    sortFBS[mtr[i][fbs.length]].push(fbs[i]);
  }

  let w = false;
  for (let i = fbs.length - 1; i >= 0; --i)
    for (let j = 0; j < sortFBS[i].length; ++j) {
      if (w) {
        if (j > 0) {
          print += " = ";
        } else {
          print += " > ";
        }
      }
      print += sortFBS[i][j].join('');
      w = true;
    }
  let grades = Array.from(Array(N), () => new Array(N).fill(0));
  for (let i = 0; i < N; ++i) {
    grades[i][0] = 1;
  }
  for (let i = 0; i < fbs.length; ++i)
    for (let j = 0; j < sortFBS[i].length; j++)
      for (let k = 0; k < N; ++k)
        if (sortFBS[i][j][k] > 1)
          grades[k][sortFBS[i][j][k] - 1] = fbs.length - i + 1;

  print += `<br><br>Vector ratings:<br>`;
  for (let i = 0; i < N; ++i) {
    print += vectors[i].join('') + " | ";
    for (let j = 0; j < N; j++) 
    vectors[i][j] = grades[j][vectors[i][j] - 1];
    print += vectors[i].join("") + " =>  ";
    vectors[i].sort(function (a, b) {
      return a - b;
    });
    print += vectors[i].join("") + `<br>`;
  }

  let min = 1000000000000;
  let min_pos = 0;
  for (let i = 0; i < N; ++i)
    if (vectors[i].join("") < min) {
      min = vectors[i].join("");
      min_pos = i;
    }
  print += `<br>The best alternative stays at number: ${min_pos + 1}`;
  info2.innerHTML = print;
}

$("body").on("click", "#next", function () {
  let i2 = I;
  let j2 = J;
  if (document.getElementById("choose").checked) {
    compMatr[I][J] = 1;
    mtr[I][J] = 1;
    mtr[I][fbs.length]++;
  } else {
    compMatr[I][J] = 3;
    mtr[J][I] = 1;
    i2 = J;
    j2 = I;
    mtr[J][fbs.length]++;
  }
  for (let k = 0; k < fbs.length; ++k) {
    if (mtr[j2][k] == 1 && mtr[i2][k] == 0) {
      mtr[i2][k] = 1;
      mtr[i2][fbs.length]++;
      if (k > i2 + 1) compMatr[i2][k] = 1;
      else compMatr[k][i2] = 3;
    }
    if (mtr[k][i2] == 1 && mtr[k][j2] == 0) {
      mtr[k][j2] = 1;
      mtr[k][fbs.length]++;
      if (j2 > k + 1) compMatr[k][j2] = 1;
      else compMatr[j2][k] = 3;
    }
  }

  createTable(fbs);
  printTable(fbs, compMatr);
  ask();
});

function firstBaseSit(N) {
  let res = new Array();
  for (let i = 0; i < N; i++) {
    for (let j = 2; j < N + 1; j++) {
      let alt = new Array(N);
      alt.fill(1);
      alt[i] = j;
      res.push(alt);
    }
  }
  return res;
}

function compAlts(alt1, alt2) {
  for (let i = 0; i < alt1.length; i++) {
    if (alt1[i] <= alt2[i]) {
      continue;
    } else {
      for (let j = 0; j < alt1.length; j++) {
        if (alt1[i] >= alt2[i]) {
          continue;
        } else console.log(0);
        return 0;
      }
      console.log(-1);
      return -1;
    }
  }
  console.log(1);
  return 1;
}

function sleep(millis) {
  var t = new Date().getTime();
  var i = 0;
  while (new Date().getTime() - t < millis) {
    i++;
  }
}
