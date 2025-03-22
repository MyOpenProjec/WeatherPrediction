// Ambil elemen DOM
const inputKota = document.getElementById('kota');
const hasilPrediksi = document.getElementById('hasil_Prediksi');

// Fungsi untuk mencari data cuaca dan prediksi banjir
async function search() {
    const kota = inputKota.value;
    if (!kota) return alert('Masukkan nama kota terlebih dahulu!');

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${kota}&units=metric&appid=046e62a2ad4794f4541d8953d1da4a9d`);
        const data = await response.json();
        if (data.cod !== 200) throw new Error(data.message);

        const suhu = data.main.temp;
        const suhuMin = data.main.temp_min;
        const suhuMax = data.main.temp_max;
        const kondisi = data.weather[0].description;
        const kecepatanAngin = data.wind.speed;
        const awan = data.clouds.all;
        const koordinat = `[${data.coord.lat}, ${data.coord.lon}]`;

        // Prediksi banjir berdasarkan data cuaca
        const risikoBanjir = Math.min((awan / 100) * 50 + (kecepatanAngin / 10) * 50, 100);
        let status = "Aman /  Berhati-hati";
        if (risikoBanjir > 60) status = "Bahaya";
        if (risikoBanjir > 80) status = "Evakuasi";

        hasilPrediksi.innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <p><b>${suhu}°C</b> ${kondisi}</p>
            <p>Temperature from ${suhuMin}°C to ${suhuMax}°C</p>
            <p>Wind Speed: ${kecepatanAngin} m/s</p>
            <p>Clouds: ${awan}%</p>
            <p>Geo Coordinates: ${koordinat}</p>
            <p><b>Prediksi Banjir:</b> ${risikoBanjir.toFixed(2)}% (${status})</p>
        `;
    } catch (error) {
        alert('Data tidak ditemukan atau terjadi kesalahan!');
        console.error(error);
    }
}
