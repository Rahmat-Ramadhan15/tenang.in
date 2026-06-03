KETERANGAN FILE-FILE YANG ADA DI FOLDER INI

data_wellbeing_kotor.csv = data dari kuisioner yang belum dipreprosesing
data_wellbeing_clean.csv = data dari kuisioner yang sudah di preprosesing
data_wellbeing_final.csv = data yang sudah bersih yang dihapus beberapa kolomnya dan menggunakan kolom yang penting-penting saja
dataset_model2_with_emotions.csv = dataset data_wellbeing_final.csv dibuatkan probabilitynya per emosi (ada 7) oleh AI Engineer.
dataset_final_labeled.csv = kemudian dari 7 probability tersebut, dibuat labelnya yang dibagi menjadi 3 yaitu Low, Medium, High yang mengacu pada tingkat burnout.

preprosesing_data_model_2.ipynb = kode untuk preprosesing dataset data_wellbeing_kotor.csv
lanjutan_data_model_2 = kode untuk menghapus kolom yang tidak dibutuhkan pada dataset data_wellbeing_clean.csv dan memberikan label.
