const submitButton = document.getElementById('btnSubmit');
const form = document.querySelector("form");
const log = document.querySelector("#log");
const all_issues = ["missing_straws", "high_current_wires", "blocked_straws", "sparking_wires", "short_wire" ] // the rest to be added

submitButton.addEventListener('click', async function () {
  console.log("Submitted ...")
  const data = new FormData(form);
  // let output = "";
  // for (const entry of data) {
  //   output = `${output}${entry[0]}=${entry[1]}\r`;
  // }
    //   log.innerText = output;
    let uw_value = parseInt(document.getElementById('uw_value').value);
    var greater_info = await getGreater(uw_value);
    document.getElementById("log").innerHTML = JSON.stringify(
	greater_info,
	undefined,
	2);

    var panels = Array(greater_info.length)
    for (let i = 0; i < greater_info.length; i++) {
	panels[i] = greater_info[i].id;
    }
    document.getElementById("panel_info").innerHTML = "Panels with "+uw_value+" missing straws: "+panels;

//    let selected = document.getElementById("issues").value
//    console.log(selected)
});

async function getGreater(uw_value) {
  const response = await fetch('http://localhost:3000/greater/' + uw_value.toString());
  const panelInfo = await response.json();
  return panelInfo;
}

const showButton = document.getElementById('btnShowAllFields');
showButton.addEventListener('click', async function () {

    var panel_number = parseInt(document.getElementById('panel_number').value);
    var this_title = "Panel "+panel_number;
    var panel_info = await getPanel(panel_number);
    document.getElementById("log").innerHTML = JSON.stringify(panel_info,
	undefined,
	2);

    var this_panel_issues = panel_info[0]['issues']

    var all_wires = Array(96).fill(0)
    var wire_numbers = Array(96).fill(0)
    for (let i = 0; i < all_wires.length; i++) {
	wire_numbers[i] = i+1;
    }

    var data = Array(all_issues.length)
    for (let i = 0; i < data.length; i++) {
	var the_issue = all_issues[i];
	var this_panel_straws = Array(96).fill(0)
	var this_panel_issue = this_panel_issues[the_issue];
	for (let i = 0; i < this_panel_issue.length; i++) {
	    this_panel_straws[this_panel_issue[i]] = 1;
	}
	var this_data = {
	    name : the_issue,
	    type : 'bar',
	    x: wire_numbers,
	    y: this_panel_straws
	};
	data[i] = this_data
    }
    
    straw_status_plot = document.getElementById('straw_status_plot');
    var xaxis = {title : {text : 'straw number'}, tickmode : "linear", tick0 : 0.0, dtick : 1.0, gridwidth : 2};
    var yaxis = {title : {text : 'no. of issues'}};
    var layout = { title : {text: this_title + " Straw/Wire Status"},
		   xaxis : xaxis,
		   yaxis : yaxis,
		   barmode : 'stack',
//		   margin: {t:0},
		   scroolZoom : true };
    Plotly.newPlot(straw_status_plot, data, layout);

    // total = missing_straws.length + high_current_wires.length + blocked_straws.length + sparking_wires.length;
    // output = "Panel "+panel_number+" has "+total+" bad channels: ("
    // if (missing_straws.length > 0) {
    // 	output += missing_straws.length + " missing straw(s), ";
    // }
    // if (high_current_wires.length > 0) {
    // 	output += high_current_wires.length + " high current wire(s), ";
    // }
    // if (blocked_straws.length > 0) {
    // 	output += blocked_straws.length + " blocked straw(s), ";
    // }
    // if (sparking_wires.length > 0) {
    // 	output += sparking_wires.length + " sparking wire(s), ";
    // }
    // output += ")";
    // document.getElementById("panel_info").innerHTML = output;
});

async function getPanel(panelNumber) {
    const response = await fetch('http://localhost:3000/panel/' + panelNumber.toString());
    const panelInfo = await response.json();
    return panelInfo;
}
