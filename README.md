# Một số quy tắc code

## Sự đơn giản

- Cố gắng viết code ngắn gọn đơn giản dễ đọc, dễ hiểu, dễ bảo trì nhất có thể.
- Làm sao để mình đọc hiểu code của mình và người khác cũng có thể hiểu code của mình là tốt nhất.
- Không lặp lại những đoạn code giống nhau, hãy module hóa và tái sử dụng.

## An toàn, cẩn thận và trách nhiệm

- Check data trước khi lấy dữ liệu ở các cấp con trong array hoặc object.
- Khai báo kiểu dữ liệu đầy đủ khi code ts.
- Tự review lại code trước khi resolve và trước khi create merge request.
- Sử dụng vòng lặp trong khi render cần có unique key cho mỗi phần tử (không sử dụng index).
- Thêm các comment giải thích cho các hàm, các đoạn code khó hiểu.

## Hàm

- Mỗi 1 hàm chỉ nên đảm nhận 1 chức năng duy nhất. Giữ hàm ngắn gọn dễ hiểu nhất.
- Luôn sử dụng try catch cho các hàm xử lý logic dễ gây lỗi.
- Một hàm không nên có quá 5 tham số.
- Mỗi hàm phải có comment giải thích chức năng, tham số và giá trị trả về (JSdoc)

## Biến

- Hạn chế khai báo biến không cần thiết.
- Dùng biến đúng cách, const cho hằng số, let cho biến số.

## Component

- Chia nhỏ các component và tái sử dụng.
- Một Component không nên quá 300 dòng code.
- Dùng ít state nhất có thể.
- Xác định đúng state nào nằm trong component nào, tránh rerender không cần thiết.
- Tạo custom hooks nếu đoạn logic đó dùng lại ở nhiều nơi.
- Hạn chế tối đa code logic trong các hàm render giao diện
- Hạn chế viết inline style, cố gắng dùng chung các style giống nhau.
- Không truyền props quá sâu, nếu phải làm vậy hãy dùng context thay thế.
- Sử dụng đuôi jsx hoặc tsx cho Render component, js hoặc ts cho file khai báo hoặc logic.

## Đặt tên

- Đặt tên hàm, tên biến có ý nghĩa, có tính gợi nhớ, dễ hiểu.
- Sử dụng cú pháp camelCase khi đặt tên cho hàm và biến.
- Sử dụng cú pháp PascalCase khi đặt tên cho Component.
- Sử dụng cú pháp snake_case khi đặt tên cho các hằng số

**Note: Tài liệu này sẽ còn được bổ sung tiếp**
