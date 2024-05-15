// Membuat fungsi untuk menambah event listener pada input daya peralatan
function addPowerInputListeners() {
  var powerInputs = document.querySelectorAll('input[type="number"]');
  powerInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      // Setelah ada perubahan pada nilai daya, aktifkan tombol
      showButton.disabled = false;
    });
  });
}

// Panggil fungsi untuk menambah event listener pada awalnya
addPowerInputListeners();

// Menambah event listener untuk tombol "Tampilkan Saran"
var showButton = document.getElementById("showButton");
showButton.addEventListener("click", calculateSafetyTips);

// Fungsi untuk menampilkan saran pengaman
function calculateSafetyTips() {
  var totalPowerData = calculateTotalPower();
  var totalPower = totalPowerData.totalPower;
  var selectedAppliances = totalPowerData.selectedAppliances;
  var safetyTips = "";

  // Validasi input daya
  if (totalPower <= 0) {
    safetyTips = "Pilih peralatan rumah tangga terlebih dahulu.";
  } else {
    // Tentukan pengaman yang cocok berdasarkan total daya
    var { protector, mcbValue } = getProtectionAndMCB(totalPower);

    if (protector !== "" && mcbValue > 0) {
      safetyTips =
        "Pilih " +
        protector +
        " dengan nilai MCB " +
        mcbValue +
        "A untuk pengamanan peralatan ini.";
    } else {
      safetyTips = "Tidak ada rekomendasi pengaman yang sesuai.";
    }
  }

  document.getElementById("safety-tips").innerText = safetyTips;

  // Menampilkan hasil perhitungan pada tabel
  displayResultTable(selectedAppliances, totalPower, mcbValue);
}

// Fungsi untuk menghitung total daya dari peralatan yang dipilih
function calculateTotalPower() {
  var totalPower = 0;
  var selectedAppliances = [];

  // Mendapatkan peralatan yang dipilih beserta daya masing-masing
  var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  checkboxes.forEach(function (checkbox) {
    var applianceId = checkbox.id;
    var powerInput = document.getElementById(applianceId + "-power");
    var power = parseInt(powerInput.value.trim());

    // Validasi input daya
    if (!isNaN(power) && power > 0) {
      totalPower += power;
      selectedAppliances.push({
        id: applianceId,
        power: power,
      });
    }
  });

  return { totalPower: totalPower, selectedAppliances: selectedAppliances };
}

// Fungsi untuk menentukan pengaman yang cocok dan nilai MCB yang sesuai berdasarkan total daya
function getProtectionAndMCB(totalPower) {
  var protector = "";
  var mcbValue = 0;

  // Tentukan pengaman dan nilai MCB yang sesuai berdasarkan total daya
  if (totalPower <= 1200) {
    protector = "MCB";
    mcbValue = 6;
  } else if (totalPower <= 2400) {
    protector = "MCB";
    mcbValue = 10;
  } else if (totalPower <= 3600) {
    protector = "MCB";
    mcbValue = 16;
  } else {
    protector = "Saklar Utama";
    mcbValue = 25;
  }

  return { protector: protector, mcbValue: mcbValue };
}

// Fungsi untuk menampilkan hasil perhitungan pada tabel
function displayResultTable(selectedAppliances, totalPower, mcbValue) {
  var resultBody = document.getElementById("result-body");
  resultBody.innerHTML = "";

  selectedAppliances.forEach(function (appliance, index) {
    var row = document.createElement("tr");
    var numberCell = document.createElement("td");
    numberCell.textContent = index + 1;
    var nameCell = document.createElement("td");
    nameCell.textContent = appliance.id;
    var powerCell = document.createElement("td");
    powerCell.textContent = appliance.power;
    row.appendChild(numberCell);
    row.appendChild(nameCell);
    row.appendChild(powerCell);
    resultBody.appendChild(row);
  });

  document.getElementById("total-power").textContent = totalPower;
  document.getElementById("mcb-value").textContent = mcbValue + "A";
}
