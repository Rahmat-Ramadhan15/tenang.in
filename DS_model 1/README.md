# 🎭 Klasifikasi Emosi Teks Bahasa Indonesia
### Capstone Project — Data Scientist

Proyek ini membangun sistem klasifikasi emosi teks berbahasa Indonesia dari komentar YouTube menggunakan dua pendekatan model: **SVM (Support Vector Machine)** dan **BiLSTM (Bidirectional Long Short-Term Memory)**.

---

## 📌 Deskripsi Proyek

Tujuan proyek ini adalah mengklasifikasikan teks berbahasa Indonesia ke dalam **7 kategori emosi**:

| ID | Emosi |
|----|-------|
| 0 | Anger (Marah) |
| 1 | Anticipation (Antisipasi) |
| 2 | Disgust (Jijik) |
| 3 | Fear (Takut) |
| 4 | Joy (Senang) |
| 5 | Sadness (Sedih) |
| 6 | Trust (Percaya) |

---

## 🗂️ Struktur Repository

```
capstone-emosi/
│
├── README.md
│
├── data/
│   ├── raw/
│   │   └── dataset1.csv                    # Hasil crawling komentar YouTube
│   ├── processed/
│   │   ├── dataset_emosi_single_label.csv  # Komentar YouTube + label emosi
│   │   ├── train_final.csv                 # Data training (HuggingFace + YouTube)
│   │   ├── val_final.csv                   # Data validasi
│   │   └── test_final.csv                  # Data testing
│   └── final/
│       └── dataset_final_lengkap.csv       # Dataset akhir siap training
│
├── notebooks/
│   ├── 01_preprocessing_youtube.ipynb      # Preprocessing & labeling komentar YouTube
│   ├── 02_labeling_emosi.ipynb             # Konversi skor SenticNet → label emosi
│   ├── 03_gabungan_dataset.ipynb           # Penggabungan dataset HuggingFace + YouTube
│   ├── 04_prep_final.ipynb                 # Preprocessing akhir & pembuatan dataset final
│   ├── 05_model_svm.ipynb                  # Training & evaluasi model SVM
│   └── 06_model_bilstm.ipynb              # Training & evaluasi model BiLSTM
│
└── assets/
    └── pipeline.png                        # Diagram alur pipeline (opsional)
```

---

## 🔄 Pipeline Proyek

```
[Crawling YouTube]
      ↓
  dataset1.csv  (5.983 komentar mentah)
      ↓
01_preprocessing_youtube.ipynb
  - Cleaning teks (hapus URL, mention, hashtag, angka)
  - Normalisasi kata tidak baku (kamus_normalisasi.csv)
  - Tokenisasi, Stopword Removal, Stemming (Sastrawi)
  - Labeling otomatis via SenticNet
      ↓
02_labeling_emosi.ipynb
  - Konversi skor polaritas SenticNet → label emosi
  - Filter komentar yang tidak terdeteksi emosinya
      ↓
dataset_emosi_single_label.csv  (537 komentar berlabel)
      ↓
03_gabungan_dataset.ipynb
  - Load dataset publik: elvanromp/emosi (HuggingFace)
  - Hapus label 'surprise', seragamkan format kolom
  - Sampling Sadness (50 baris) untuk mengurangi imbalance
  - Gabungkan HuggingFace + YouTube
      ↓
train_final.csv / val_final.csv / test_final.csv
      ↓
04_prep_final.ipynb
  - Gabungkan kembali 3 split menjadi satu
  - Preprocessing ulang: cleaning, normalisasi slang, stopword, stemming
  - Tambah kolom label string + label integer
  - Pisah menjadi 2 versi teks: teks_no_stop (BiLSTM) & teks_final (SVM)
      ↓
dataset_final_lengkap.csv  (3.727 baris, 7 emosi, siap training)
      ↓
  ┌─────────────┐        ┌──────────────────┐
  │ SVM + TF-IDF│        │ BiLSTM + Embedding│
  │ (teks_final)│        │ (teks_no_stop)   │
  └─────────────┘        └──────────────────┘
```

---

## 📦 Sumber Data

| Sumber | Keterangan | Jumlah |
|--------|-----------|--------|
| Crawling YouTube | Komentar konten psikologi/kesehatan mental | ~5.983 |
| [elvanromp/emosi](https://huggingface.co/datasets/elvanromp/emosi) | Dataset emosi bahasa Indonesia dari HuggingFace | ~3.200+ |
| **Total (setelah preprocessing)** | Dataset final gabungan | **3.727** |

---

## 🛠️ Library & Tools

```
Python 3.x
pandas, numpy
scikit-learn
imbalanced-learn (SMOTE)
Sastrawi (stemming & stopword bahasa Indonesia)
NLTK
TensorFlow / Keras (BiLSTM)
datasets (HuggingFace)
matplotlib, seaborn, wordcloud
```

Install semua dependency:
```bash
pip install sastrawi nltk scikit-learn imbalanced-learn datasets tensorflow wordcloud
```

---

## 📓 Deskripsi Notebook

### `01_preprocessing_youtube.ipynb`
Preprocessing lengkap komentar YouTube mentah:
- Cleaning teks (URL, mention, hashtag, angka, karakter non-ASCII)
- Normalisasi kata tidak baku menggunakan `kamus_normalisasi.csv`
- Tokenisasi dengan NLTK
- Stopword removal (Sastrawi + `kamus_stopword.csv` custom)
- Stemming dengan Sastrawi
- Labeling otomatis berbasis leksikon **SenticNet** (bigram & trigram support)

### `02_labeling_emosi.ipynb`
Konversi hasil skor SenticNet menjadi label emosi tunggal per kalimat:
- Ambil emosi dengan skor tertinggi dari seluruh token per kalimat
- Filter kalimat yang tidak ada token-nya di SenticNet
- Output: `dataset_emosi_single_label.csv` (537 baris)

### `03_gabungan_dataset.ipynb`
Penggabungan dua sumber data:
- Load dataset `elvanromp/emosi` dari HuggingFace (train/val/test)
- Hapus label `surprise` agar konsisten 7 emosi
- Sampling Sadness dari data YouTube (50 baris) untuk mengurangi dominasi
- Gabungkan → `train_final.csv`, `val_final.csv`, `test_final.csv`

### `04_prep_final.ipynb`
Preprocessing akhir dan pembuatan dataset siap training:
- Gabungkan kembali 3 split menjadi satu DataFrame
- Preprocessing ulang (cleaning, slang normalization, stopword, stemming)
- Hasilkan dua kolom teks: `teks_no_stop` (untuk BiLSTM) dan `teks_final` (untuk SVM)
- Tambah `label_id` (integer) dan simpan sebagai `dataset_final_lengkap.csv`

### `05_model_svm.ipynb` *(coming soon)*
Training dan evaluasi model SVM:
- Fitur: TF-IDF dari `teks_final`
- Handling imbalance: SMOTE
- Evaluasi: accuracy, classification report, confusion matrix

### `06_model_bilstm.ipynb` *(coming soon)*
Training dan evaluasi model BiLSTM:
- Input: `teks_no_stop` dengan word embedding
- Arsitektur: Embedding → BiLSTM → Dense → Softmax
- Evaluasi: accuracy, classification report, confusion matrix

---

## 📊 Distribusi Dataset Final

| Emosi | Jumlah |
|-------|--------|
| Fear | 569 |
| Sadness | 550 |
| Anticipation | 541 |
| Anger | 523 |
| Joy | 521 |
| Trust | 515 |
| Disgust | 508 |
| **Total** | **3.727** |


---

## 📄 Lisensi

Dataset publik dari HuggingFace mengikuti lisensi masing-masing sumber.  
Kode dalam repositori ini untuk keperluan akademik.
