# Các bước chạy dự án và bypass login

### 1. Chạy dự án

> #### `yarn start` or `npm run start`

### 2. Mở website DEV & thêm 1 key localStorage trên môi trường DEV or UAT

> #### `"debugger": 1`

### 3. Dưới môi trường local thêm 1 key trong localStorage

> #### `"sitename": <your_sitename>`

### 4. Nhập sitename vào môi trường DEV và đăng nhập như bình thường.

> (do đã xử lý trong code nếu có key `"debugger"` trong localStorage sẽ không đăng nhập
> => nên đến bước login sẽ bị chặn và có thể lấy code trên url )

### 5. Copy code trên url paste vào môi trường local sẽ bypass login được.

> Đoạn code xử lý chặn login và bypass login ở useEffect trong LoginForm.tsx
