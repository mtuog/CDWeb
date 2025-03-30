const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(session({
  secret: '123456789',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.post('/save-user', (req, res) => {
  const user = req.body;
  const filePath = path.join(__dirname, 'users.json');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ users: [], nextId: 1 }), 'utf8');
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to read file' });
    }

    let fileContent = JSON.parse(data);
    let users = fileContent.users;
    let nextId = fileContent.nextId;

    user.id = nextId;
    nextId += 1;

    users.push(user);

    fs.writeFile(filePath, JSON.stringify({ users: users, nextId: nextId }, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to save user' });
      }
      res.status(200).json({ message: 'Đăng ký thành công', userId: user.id });
    });
  });
});
app.post('/save-contact', (req, res) => {
  console.log('Received request to /save-contact'); // Log for debugging
  const newContact = req.body;
  const filePath = path.join(__dirname, 'contact.json');
  console.log('File path:', filePath); // Log for debugging

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ contacts: [], nextId: 1 }), 'utf-8');
  }

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err); // Log for debugging
      return res.status(500).json({ message: 'Không thể đọc được file' });
    }

    let fileContent;
    try {
      fileContent = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr); // Log for debugging
      return res.status(500).json({ message: 'Lỗi phân tích file JSON' });
    }

    let contacts = fileContent.contacts;
    let nextId = fileContent.nextId;

    newContact.id = nextId;
    nextId += 1;
    contacts.push(newContact);

    fs.writeFile(filePath, JSON.stringify({ contacts: contacts, nextId: nextId }, null, 2), err => {
      if (err) {
        console.error('Error writing file:', err); // Log for debugging
        return res.status(500).json({ message: 'Không thể lưu contact' });
      }
      res.status(200).json({ message: 'Liên hệ thành công', contactId: newContact.id });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const filePath = path.join(__dirname, 'users.json');

  if (!fs.existsSync(filePath)) {
    return res.status(400).json({ message: 'No users found' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to read file' });
    }

    const fileContent = JSON.parse(data);
    const users = fileContent.users;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      req.session.userId = user.id;
      req.session.username = user.username;
      res.status(200).json({ message: 'Đăng nhập thành công', user: user });
    } else {
      res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }
  });
});

app.get('/session', (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ loggedIn: true, userId: req.session.userId, username: req.session.username });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Đăng xuất thất bại' });
    }
    res.status(200).json({ message: 'Đăng xuất thành công' });
  });
});
app.post('/change-password', (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Vui Lòng Đăng Nhập' });
  }

  const filePath = path.join(__dirname, 'users.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Không có file để đọc' });
    }

    const fileContent = JSON.parse(data);
    const users = fileContent.users;
    const user = users.find(u => u.id === userId);

    if (!user || user.password !== oldPassword) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    }

    user.password = newPassword;

    fs.writeFile(filePath, JSON.stringify(fileContent, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to update password' });
      }
      res.status(200).json({ message: 'Đổi Mật Khẩu Thành Công' });
    });
  });
});
app.get('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const filePath = path.join(__dirname, 'users.json');

  console.log('Received request for user ID:', userId); // Log the request

  if (!fs.existsSync(filePath)) {
    console.log('users.json file does not exist.');
    return res.status(400).json({ message: 'No users found' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users.json file:', err);
      return res.status(500).json({ message: 'Failed to read file' });
    }

    const fileContent = JSON.parse(data);
    const users = fileContent.users;

    const user = users.find(u => u.id === userId);

    if (user) {
      console.log('User data:', user); // Log user data for debugging
      res.status(200).json(user);
    } else {
      console.log('User not found with ID:', userId);
      res.status(404).json({ message: 'User not found' });
    }
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
