const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const { json } = require('express/lib/response');

const connection = mysql.createConnection({
  host: 'localhost', // hoặc '127.0.0.1'
  port: 3306,
  user: 'root',
  password: 'admin',
  database: 'hustory'
});

// Kết nối đến cơ sở dữ liệu
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Cấu hình Express để phục vụ các tệp tĩnh từ thư mục 'hustory'
app.use(express.static(path.join(__dirname, 'hustory')));




// Route cho trang chủ, trỏ tới file index.html trong thư mục hustory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/assets/css/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'css', 'style.css'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/assets/css/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'css', 'style.css'));
});

app.get('/getLatest' , (req, res) =>{ 
  const sql = 'SELECT story.storyId, chapter.chapterId, story.storyName, chapter.chapterNumber, chapter.chapterNumber, chapter.publishTime FROM chapter JOIN story ON story.storyId = chapter.storyId ORDER BY chapter.publishTime DESC LIMIT 15;'
  connection.query(sql, (err, results) =>{
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Kiểm tra xem có kết quả nào không
    if (results.length === 0) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Trả về dữ liệu của story
    const story = results;
    res.json(story);
  });
}); 

app.get('/getComplete' , (req, res) =>{ 
  const sql = "SELECT s.storyStatus, s.storyImg, s.storyId, s.storyName, COUNT(c.chapterId) AS chapterCount FROM story s LEFT JOIN chapter c ON s.storyId = c.storyId WHERE s.storyStatus = 'Full' GROUP BY s.storyId, s.storyName;"
  connection.query(sql, (err, results) =>{
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Kiểm tra xem có kết quả nào không
    if (results.length === 0) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Trả về dữ liệu của story
    const story = results;
    res.json(story);
  });
}); 





// Route cho form đăng ký đăng nhập, trỏ tới file form.html trong thư mục hustory
app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

app.get('/assets/css/form.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'css', 'form.css'));
});





// Route cho chương truyện, trỏ tới file chapter.html trong thư mục hustory
app.get('/story/:id1/chapter/:id2', (req, res) => {
  res.sendFile(path.join(__dirname, 'chapter.html'));
});

app.get('/assets/css/chapter.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'css', 'chapter.css'));
});
//Lấy nội dung chương truyện
app.get('/story/:id1/chapter/:id2/getContent' , (req, res) =>{ 
  const storyId = req.params.id1;
  const chapterId = req.params.id2;
  const sql = 'SELECT storyName, chapterName, chapterNumber, chapterId, chapterContent FROM chapter JOIN story ON chapter.storyId = story.storyId WHERE chapter.storyId = ? AND chapterId = ?'
  connection.query(sql, [storyId, chapterId], (err, results) =>{
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Kiểm tra xem có kết quả nào không
    if (results.length === 0) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Trả về dữ liệu của story
    const story = results;
    res.json(story);
  });
});
//Tăng view cho truyện
app.put('/story/:storyId/incrementView', (req, res) => {
  const storyId = req.params.storyId;

  const sqlUpdateStoryViews = 'UPDATE story SET views = views + 1 WHERE storyId = ?';

  connection.query(sqlUpdateStoryViews, [storyId], (err, results) => {
    if (err) {
      console.error('Error updating views:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json({ message: 'Views updated successfully' });
  });
});






// Route cho danh sách truyện, trỏ tới file list.html trong thư mục hustory
app.get('/list', (req, res) => {
  res.sendFile(path.join(__dirname, 'list.html'));
});

app.get('/assets/css/list.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'css', 'list.css'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/assets/css/profile.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'css', 'profile.css'));
});






// Route cho truyện, trỏ tới file story.html trong thư mục hustory
app.get('/story/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'story.html'));
});

app.get('/assets/css/storyStyle.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'css', 'storyStyle.css'));
});

app.get('/story/getStory/:id', (req, res) => {
  const storyId = req.params.id;

  // Truy vấn cơ sở dữ liệu để lấy thông tin của story có id là storyId
  const sql = 'SELECT * FROM story WHERE storyId = ?';
  connection.query(sql, [storyId], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Kiểm tra xem có kết quả nào không
    if (results.length === 0) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Trả về dữ liệu của story
    const story = results[0];
    res.json(story);
  });
});
//Lấy các chương truyện mới nhất cho trang truyện
app.get('/story/getLatest/:id' , (req, res) =>{ 
  const storyId = req.params.id;
  const sql = 'SELECT chapterName, chapterNumber, chapterId FROM chapter WHERE storyId = ? ORDER BY publishTime DESC LIMIT 3;'
  connection.query(sql, [storyId], (err, results) =>{
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Kiểm tra xem có kết quả nào không
    if (results.length === 0) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Trả về dữ liệu của story
    const story = results;
    res.json(story);
  });
}); 
//Lấy các chương truyện của truyện
app.get('/story/getChapter/:id' , (req, res) =>{ 
  const storyId = req.params.id;
  const sql = 'SELECT chapterName, chapterNumber, chapterId FROM chapter WHERE storyId = ? ORDER BY chapterNumber;'
  connection.query(sql, [storyId], (err, results) =>{
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Kiểm tra xem có kết quả nào không
    if (results.length === 0) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Trả về dữ liệu của story
    const story = results;
    res.json(story);
  });
}); 




// Route để lấy danh sách các thể loại của một truyện từ cơ sở dữ liệu
app.get('/story/getCategory/:id', (req, res) => {
  const storyId = req.params.id;
  const sql = `
    SELECT c.categoryName
    FROM story_category sc
    JOIN story s ON sc.storyId = s.storyId
    JOIN category c ON c.categoryId = sc.categoryId
    WHERE s.storyId = ?;
  `;
  
  connection.query(sql, [storyId], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (results.length === 0) {
      res.status(404).json({ error: 'Story not found or has no categories' });
      return;
    }
    
    // Biến đổi kết quả thành mảng các thể loại
    const categories = results.map(result => result.categoryName);
    
    res.json({ categories });
  });
});


app.get('/popular', (req, res) => {
  const storyId = req.params.id;
  const sql = `
    SELECT *
    FROM story
    ORDER BY views DESC
    LIMIT 10;  
  `;
  
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (results.length === 0) {
      res.status(404).json({ error: 'Story not found or has no categories' });
      return;
    }
    
    res.json(results);
  });
});


app.get('/search/category/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'list.html'));
});

app.get('/assets/css/list.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'css', 'list.css'));
});

app.get('/search/category/:id/getContent', (req, res) => {
  const categoryId = req.params.id;
  const sql = `
  SELECT 
    s.storyId,
    s.storyName,
    s.storyIntro,
    s.storyRating,
    s.storyAuthor,
    s.storyImg,
    s.storyStatus,
    c.categoryName,
    COUNT(ch.chapterId) AS totalChapters
  FROM 
      story s
  JOIN 
      story_category sc ON s.storyId = sc.storyId
  JOIN 
      category c ON sc.categoryId = c.categoryId
  LEFT JOIN
      chapter ch ON s.storyId = ch.storyId
  WHERE 
      sc.categoryId = ?
  GROUP BY
    s.storyId, s.storyName, s.storyIntro, s.storyRating, s.storyAuthor, s.storyImg, s.storyStatus, c.categoryName;

  `;
  
  connection.query(sql, [categoryId] , (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (results.length === 0) {
      res.status(404).json({ error: 'Story not found or has no categories' });
      return;
    }
    
    res.json(results);
  });
});



app.get('/search/:name', (req, res) => {
  res.sendFile(path.join(__dirname, 'list.html'));
});

app.get('/assets/css/list.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'css', 'list.css'));
});

app.get('/search/:name/getContent', (req, res) => {
  const storyName = req.params.name;
  const sql = `
  SELECT 
      s.storyId,
      s.storyName,
      s.storyIntro,
      s.storyRating,
      s.storyAuthor,
      s.storyImg,
      s.storyStatus,
  COUNT(ch.chapterId) AS totalChapters
  FROM 
      story s
  LEFT JOIN
      chapter ch ON s.storyId = ch.storyId
  WHERE 
      s.storyName LIKE CONCAT('%', ?, '%')
  GROUP BY
      s.storyId, s.storyName, s.storyIntro, s.storyRating, s.storyAuthor, s.storyImg, s.storyStatus;`;
  
  connection.query(sql, [storyName] , (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (results.length === 0) {
      res.status(404).json({ error: 'Story not found or has no categories' });
      return;
    }
    
    res.json(results);
  });
});


// Bắt đầu server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
