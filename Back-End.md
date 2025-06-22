Domain Adresi: [Large](https://large-vud1.onrender.com/)

Docker: Kullanıldı.

REST API: Kullanıldı.

Redis:Kullanıldı.

RabbitMQ: Kullanıldı.

CI/CD: Kullanıldıı.

# İlayda Arzu Akkuş Backend #

Bu projede backend kısmı Flask ile geliştirilmiştir. Aşağıda üstlendiğim tüm backend gereksinimleri yer almaktadır:

## 1. Kullanıcı Kayıt (Register)
Kullanıcının e-posta, kullanıcı adı ve şifresi alınarak veritabanına kaydedilir. Şifre güvenli şekilde hashlenir. Kayıt sonrası oturum başlatılır.

## 2. İlgi Alanı Sayfası (Interest Selection)
Kullanıcı kayıt olduktan sonra yönlendirildiği sayfadır. Konu (topic) verileri backend'den çekilerek kullanıcıya gösterilir. Seçilen konular kullanıcı ilgi alanları olarak frontend tarafından işlenir.

## 3. Kullanıcı Giriş (Login)
Kullanıcının e-posta ve şifresi doğrulanarak oturum açılır.

## 4. Kullanıcı Çıkış (Logout)
Kullanıcının aktif oturumu sonlandırılır.

## 5. Post Oluşturma
Giriş yapan kullanıcı başlık, içerik ve konu bilgisiyle gönderi paylaşabilir.

## 6. Post Listeleme
Tüm gönderiler veritabanından çekilerek kullanıcıya listelenir.

## 7. Post Arama
Kullanıcı tarafından girilen kelimelere göre gönderi, kullanıcı ve konu araması yapılır.  
Ayrıca, en çok yorum alan gönderiler öne çıkarılarak arama sonuçlarında gösterilir.

## 8. Yorum Yapma
Kullanıcı gönderilere yorum yapabilir. Yapılan yorumlar gönderilere bağlı şekilde saklanır.  
Her yorum işlemi sonrasında ilgili sistemlere haber verilmek üzere mesaj kuyruğuna bilgi düşer.

## 9. Beğenme (Like)
Kullanıcı gönderileri beğenebilir. Beğeni sayısı güncellenir.

## 10. Kaydetme (Save)
Kullanıcı gönderileri profiline kaydedebilir, daha sonra görüntüleyebilir.

## 11. Kişi Takibi (User Follow)
Kullanıcı, diğer kullanıcıları takip edebilir. Takip edilenlerin içerikleri ana akışa yansıtılabilir.

## 12. Konu Takibi (Topic Follow)
Kullanıcı, ilgi duyduğu konuları (topic) takip edebilir. Bu konularla ilgili gönderiler öncelikli gösterilir.

## 13. Profil Sayfası
Kullanıcının paylaştığı gönderiler, takip ettiği kişiler ve konular, kaydettiği gönderiler ve profil bilgileri görüntülenir.

## 14. Redis Kullanımı
Oturum verileri ve sık erişilen içerikler Redis ile önbelleğe alınarak performans artırılmıştır.  
Ayrıca, en çok yorum alan gönderiler Redis üzerinde saklanarak arama çubuğunda hızlı şekilde sunulur.

## 15. RabbitMQ Kullanımı
Yeni gönderi paylaşıldığında veya yorum yapıldığında bu olaylar mesaj kuyruğuna eklenir.  

## 16. Docker
Backend uygulaması Docker container içinde çalışacak şekilde yapılandırılmıştır.  
Projede ayrıca Redis, RabbitMQ gibi servislerin birlikte yönetilmesi için **Docker Compose** kullanılmıştır.

## 17. CI/CD
GitHub Actions kullanılarak yapılan kod değişikliklerinde otomatik test, build ve deploy işlemleri uygulanmıştır.


🔗 **GitHub Repository:** [https://github.com/iarzuakkus/Large](https://github.com/iarzuakkus/Large)
