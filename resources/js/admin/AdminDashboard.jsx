import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admindashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with API calls
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Calculus Made Easy",
      author: "Silvanus Thompson",
      subject: "math",
      description: "A comprehensive guide to calculus concepts.",
      isbn: "978-0486404529",
      totalCopies: 5,
      availableCopies: 3,
      status: "available"
    },
    {
      id: 2,
      title: "Psychology 101",
      author: "Paul Kleinman",
      subject: "psychology",
      description: "Introduction to psychology covering major theories.",
      isbn: "978-1440582786",
      totalCopies: 3,
      availableCopies: 1,
      status: "available"
    },
    {
      id: 3,
      title: "English Literature",
      author: "William Shakespeare",
      subject: "literature",
      description: "Classic English literature works and analysis.",
      isbn: "978-0743477109",
      totalCopies: 4,
      availableCopies: 4,
      status: "available"
    }
  ]);

  const [borrowedBooks, setBorrowedBooks] = useState([
    {
      id: 1,
      bookId: 2,
      title: "Psychology 101",
      author: "Paul Kleinman",
      userId: 101,
      userName: "John Doe",
      userEmail: "john@example.com",
      borrowDate: "2024-01-10",
      dueDate: "2024-01-24",
      status: "borrowing",
      daysRemaining: 5
    },
    {
      id: 2,
      bookId: 1,
      title: "Calculus Made Easy",
      author: "Silvanus Thompson",
      userId: 102,
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      borrowDate: "2024-01-05",
      dueDate: "2024-01-19",
      status: "overdue",
      daysOverdue: 2
    }
  ]);

  const [penalties, setPenalties] = useState([
    {
      id: 1,
      userId: 102,
      userName: "Jane Smith",
      bookTitle: "Calculus Made Easy",
      reason: "Overdue return - 2 days late",
      amount: 10,
      status: "unpaid",
      issueDate: "2024-01-20",
      dueDate: "2024-01-27"
    }
  ]);

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Library Holiday Schedule",
      content: "The library will be closed on January 26th for Republic Day.",
      date: "2024-01-15",
      status: "active"
    },
    {
      id: 2,
      title: "New Book Arrivals",
      content: "Check out our new collection of science fiction books!",
      date: "2024-01-10",
      status: "active"
    }
  ]);

  const [users, setUsers] = useState([
    {
      id: 101,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-01-01"
    },
    {
      id: 102,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-01-02"
    },
    {
      id: 103,
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      status: "active",
      joinDate: "2024-01-01"
    }
  ]);

  // Form states
  const [showBookForm, setShowBookForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    subject: "",
    description: "",
    isbn: "",
    totalCopies: 1
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: ""
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Book CRUD Operations
  const handleAddBook = () => {
    const newBook = {
      id: books.length + 1,
      ...bookForm,
      availableCopies: bookForm.totalCopies,
      status: "available"
    };
    setBooks([...books, newBook]);
    setShowBookForm(false);
    setBookForm({ title: "", author: "", subject: "", description: "", isbn: "", totalCopies: 1 });
    alert("Book added successfully!");
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      subject: book.subject,
      description: book.description,
      isbn: book.isbn,
      totalCopies: book.totalCopies
    });
    setShowBookForm(true);
  };

  const handleUpdateBook = () => {
    setBooks(books.map(book => 
      book.id === editingBook.id 
        ? { ...book, ...bookForm, availableCopies: bookForm.totalCopies - (book.totalCopies - book.availableCopies) }
        : book
    ));
    setShowBookForm(false);
    setEditingBook(null);
    setBookForm({ title: "", author: "", subject: "", description: "", isbn: "", totalCopies: 1 });
    alert("Book updated successfully!");
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter(book => book.id !== bookId));
      alert("Book deleted successfully!");
    }
  };

  // Announcement CRUD Operations
  const handleAddAnnouncement = () => {
    const newAnnouncement = {
      id: announcements.length + 1,
      ...announcementForm,
      date: new Date().toISOString().split('T')[0],
      status: "active"
    };
    setAnnouncements([...announcements, newAnnouncement]);
    setShowAnnouncementForm(false);
    setAnnouncementForm({ title: "", content: "" });
    alert("Announcement added successfully!");
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content
    });
    setShowAnnouncementForm(true);
  };

  const handleUpdateAnnouncement = () => {
    setAnnouncements(announcements.map(ann => 
      ann.id === editingAnnouncement.id 
        ? { ...ann, ...announcementForm }
        : ann
    ));
    setShowAnnouncementForm(false);
    setEditingAnnouncement(null);
    setAnnouncementForm({ title: "", content: "" });
    alert("Announcement updated successfully!");
  };

  const handleDeleteAnnouncement = (announcementId) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(announcements.filter(ann => ann.id !== announcementId));
      alert("Announcement deleted successfully!");
    }
  };

  // Penalty Management
  const handleUpdatePenalty = (penaltyId, updates) => {
    setPenalties(penalties.map(penalty => 
      penalty.id === penaltyId ? { ...penalty, ...updates } : penalty
    ));
  };

  const handleMarkPenaltyPaid = (penaltyId) => {
    handleUpdatePenalty(penaltyId, { status: "paid" });
    alert("Penalty marked as paid!");
  };

  // Borrow Management
  const handleUpdateDueDate = (borrowId, newDueDate) => {
    setBorrowedBooks(borrowedBooks.map(borrow => 
      borrow.id === borrowId ? { ...borrow, dueDate: newDueDate } : borrow
    ));
    alert("Due date updated successfully!");
  };

  const handleReturnBook = (borrowId) => {
    const borrowedBook = borrowedBooks.find(borrow => borrow.id === borrowId);
    if (borrowedBook) {
      // Update book available copies
      setBooks(books.map(book => 
        book.id === borrowedBook.bookId 
          ? { ...book, availableCopies: book.availableCopies + 1 }
          : book
      ));
      
      // Remove from borrowed books
      setBorrowedBooks(borrowedBooks.filter(borrow => borrow.id !== borrowId));
      alert("Book returned successfully!");
    }
  };

  // User Management
  const handleToggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "suspended" : "active" }
        : user
    ));
  };

  // Statistics
  const stats = {
    totalBooks: books.length,
    availableBooks: books.filter(book => book.status === "available").length,
    borrowedBooks: borrowedBooks.filter(book => book.status === "borrowing").length,
    overdueBooks: borrowedBooks.filter(book => book.status === "overdue").length,
    totalUsers: users.length,
    activeAnnouncements: announcements.filter(ann => ann.status === "active").length,
    totalPenalties: penalties.length,
    unpaidPenalties: penalties.filter(p => p.status === "unpaid").length
  };

  // Render Methods
  const renderOverview = () => (
    <div className="tab-content">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Books</h3>
          <p className="stat-number">{stats.totalBooks}</p>
        </div>
        <div className="stat-card">
          <h3>Available Books</h3>
          <p className="stat-number">{stats.availableBooks}</p>
        </div>
        <div className="stat-card">
          <h3>Borrowed Books</h3>
          <p className="stat-number">{stats.borrowedBooks}</p>
        </div>
        <div className="stat-card">
          <h3>Overdue Books</h3>
          <p className="stat-number">{stats.overdueBooks}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Unpaid Penalties</h3>
          <p className="stat-number">{stats.unpaidPenalties}</p>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span>📚</span>
            <span>New book "Advanced Physics" added</span>
            <span className="activity-time">2 hours ago</span>
          </div>
          <div className="activity-item">
            <span>⚠️</span>
            <span>Penalty issued to Jane Smith</span>
            <span className="activity-time">1 day ago</span>
          </div>
          <div className="activity-item">
            <span>📢</span>
            <span>New announcement posted</span>
            <span className="activity-time">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBooksManagement = () => (
    <div className="tab-content">
      <div className="section-header">
        <h3>Books Management</h3>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingBook(null);
            setBookForm({ title: "", author: "", subject: "", description: "", isbn: "", totalCopies: 1 });
            setShowBookForm(true);
          }}
        >
          + Add New Book
        </button>
      </div>

      {showBookForm && (
        <div className="form-modal">
          <div className="form-content">
            <h4>{editingBook ? "Edit Book" : "Add New Book"}</h4>
            <input
              type="text"
              placeholder="Book Title"
              value={bookForm.title}
              onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
            />
            <input
              type="text"
              placeholder="Author"
              value={bookForm.author}
              onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
            />
            <input
              type="text"
              placeholder="Subject"
              value={bookForm.subject}
              onChange={(e) => setBookForm({...bookForm, subject: e.target.value})}
            />
            <input
              type="text"
              placeholder="ISBN"
              value={bookForm.isbn}
              onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
            />
            <textarea
              placeholder="Description"
              value={bookForm.description}
              onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
            />
            <input
              type="number"
              placeholder="Total Copies"
              value={bookForm.totalCopies}
              onChange={(e) => setBookForm({...bookForm, totalCopies: parseInt(e.target.value) || 1})}
              min="1"
            />
            <div className="form-actions">
              <button 
                className="btn-primary"
                onClick={editingBook ? handleUpdateBook : handleAddBook}
              >
                {editingBook ? "Update Book" : "Add Book"}
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowBookForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Subject</th>
              <th>ISBN</th>
              <th>Copies</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.subject}</td>
                <td>{book.isbn}</td>
                <td>{book.totalCopies}</td>
                <td>{book.availableCopies}</td>
                <td>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditBook(book)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBorrowedBooks = () => (
    <div className="tab-content">
      <div className="section-header">
        <h3>Borrowed Books Management</h3>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>User</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map(borrow => (
              <tr key={borrow.id}>
                <td>{borrow.title}</td>
                <td>
                  <div>{borrow.userName}</div>
                  <div className="user-email">{borrow.userEmail}</div>
                </td>
                <td>{borrow.borrowDate}</td>
                <td>
                  <input
                    type="date"
                    value={borrow.dueDate}
                    onChange={(e) => handleUpdateDueDate(borrow.id, e.target.value)}
                    className="date-input"
                  />
                </td>
                <td>
                  <span className={`status-badge ${borrow.status}`}>
                    {borrow.status}
                  </span>
                  {borrow.status === "borrowing" && borrow.daysRemaining && (
                    <div className="days-info">{borrow.daysRemaining} days remaining</div>
                  )}
                  {borrow.status === "overdue" && borrow.daysOverdue && (
                    <div className="days-info overdue">{borrow.daysOverdue} days overdue</div>
                  )}
                </td>
                <td>
                  <button 
                    className="btn-primary"
                    onClick={() => handleReturnBook(borrow.id)}
                  >
                    Mark Returned
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPenalties = () => (
    <div className="tab-content">
      <div className="section-header">
        <h3>Penalties Management</h3>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Book</th>
              <th>Reason</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {penalties.map(penalty => (
              <tr key={penalty.id}>
                <td>
                  <div>{penalty.userName}</div>
                  <div className="user-email">ID: {penalty.userId}</div>
                </td>
                <td>{penalty.bookTitle}</td>
                <td>{penalty.reason}</td>
                <td>${penalty.amount}</td>
                <td>
                  <span className={`status-badge ${penalty.status}`}>
                    {penalty.status}
                  </span>
                </td>
                <td>{penalty.dueDate}</td>
                <td>
                  {penalty.status === "unpaid" && (
                    <button 
                      className="btn-primary"
                      onClick={() => handleMarkPenaltyPaid(penalty.id)}
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="tab-content">
      <div className="section-header">
        <h3>Announcements Management</h3>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingAnnouncement(null);
            setAnnouncementForm({ title: "", content: "" });
            setShowAnnouncementForm(true);
          }}
        >
          + New Announcement
        </button>
      </div>

      {showAnnouncementForm && (
        <div className="form-modal">
          <div className="form-content">
            <h4>{editingAnnouncement ? "Edit Announcement" : "Create Announcement"}</h4>
            <input
              type="text"
              placeholder="Announcement Title"
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
            />
            <textarea
              placeholder="Announcement Content"
              value={announcementForm.content}
              onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
              rows="4"
            />
            <div className="form-actions">
              <button 
                className="btn-primary"
                onClick={editingAnnouncement ? handleUpdateAnnouncement : handleAddAnnouncement}
              >
                {editingAnnouncement ? "Update Announcement" : "Create Announcement"}
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowAnnouncementForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="announcements-grid">
        {announcements.map(announcement => (
          <div key={announcement.id} className="announcement-card">
            <div className="announcement-header">
              <h4>{announcement.title}</h4>
              <span className="announcement-date">{announcement.date}</span>
            </div>
            <p className="announcement-content">{announcement.content}</p>
            <div className="announcement-actions">
              <button 
                className="btn-edit"
                onClick={() => handleEditAnnouncement(announcement)}
              >
                Edit
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDeleteAnnouncement(announcement.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="tab-content">
      <div className="section-header">
        <h3>Users Management</h3>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.joinDate}</td>
                <td>
                  <button 
                    className={user.status === "active" ? "btn-warning" : "btn-primary"}
                    onClick={() => handleToggleUserStatus(user.id)}
                  >
                    {user.status === "active" ? "Suspend" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📊 Admin Dashboard - ShelfSync</h1>
          <div className="user-info">
            <span>Welcome, <strong>{user?.name}</strong>!</span>
            <span className="user-role">({user?.role})</span>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === "books" ? "active" : ""}`}
          onClick={() => setActiveTab("books")}
        >
          📚 Books Management
        </button>
        <button 
          className={`nav-btn ${activeTab === "borrowed" ? "active" : ""}`}
          onClick={() => setActiveTab("borrowed")}
        >
          🔄 Borrowed Books
        </button>
        <button 
          className={`nav-btn ${activeTab === "penalties" ? "active" : ""}`}
          onClick={() => setActiveTab("penalties")}
        >
          ⚠️ Penalties
        </button>
        <button 
          className={`nav-btn ${activeTab === "announcements" ? "active" : ""}`}
          onClick={() => setActiveTab("announcements")}
        >
          📢 Announcements
        </button>
        <button 
          className={`nav-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 Users
        </button>
      </nav>

      <main className="dashboard-main">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "books" && renderBooksManagement()}
        {activeTab === "borrowed" && renderBorrowedBooks()}
        {activeTab === "penalties" && renderPenalties()}
        {activeTab === "announcements" && renderAnnouncements()}
        {activeTab === "users" && renderUsers()}
      </main>
    </div>
  );
}