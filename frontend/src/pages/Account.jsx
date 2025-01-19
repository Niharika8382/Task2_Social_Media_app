import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import Modal from "../components/Modal";
import axios from "axios";
import { Loading } from "../components/Loading";
import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";

const Account = ({ user }) => {
  const navigate = useNavigate();

  const { logoutUser, updateProfilePic, updateProfileName } = UserData();
  const { posts, reels, loading } = PostData();

  let myPosts = posts
    ? posts.filter((post) => post.owner._id === user._id)
    : [];
  let myReels = reels
    ? reels.filter((reel) => reel.owner._id === user._id)
    : [];

  const [type, setType] = useState("post");
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  const [file, setFile] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState(user.name ? user.name : "");
  const [showUpdatePass, setShowUpdatePass] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const logoutHandler = () => logoutUser(navigate);

  const prevReel = () => index > 0 && setIndex(index - 1);
  const nextReel = () => index < myReels.length - 1 && setIndex(index + 1);

  const changeFileHandler = (e) => setFile(e.target.files[0]);

  const changleImageHandler = () => {
    const formdata = new FormData();
    formdata.append("file", file);
    updateProfilePic(user._id, formdata, setFile);
  };

  const UpdateName = () => updateProfileName(user._id, name, setShowInput);

  async function followData() {
    try {
      const { data } = await axios.get("/api/user/followdata/" + user._id);
      setFollowersData(data.followers);
      setFollowingsData(data.followings);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    followData();
  }, [user]);

  const generateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit OTP
    setGeneratedOtp(otp);
    toast.success(`Your OTP is: ${otp}`); // Display OTP using toast
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      toast.error("Invalid OTP. Please try again.");
      return;
    }
    try {
      const { data } = await axios.post("/api/user/" + user._id, {
        otp,
        newPassword,
      });
      toast.success(data.message);
      setOtp("");
      setGeneratedOtp("");
      setNewPassword("");
      setShowUpdatePass(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {user && (
            <>
              <div className="bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center pt-3 pb-14">
                {show && (
                  <Modal
                    value={followersData}
                    title="Followers"
                    setShow={setShow}
                  /> 
                )}
                {show1 && (
                  <Modal
                    value={followingsData}
                    title="Followings"
                    setShow={setShow1}
                  />
                )}

                <div className="bg-white flex justify-between gap-4 p-8 rounded-lg shadow-md max-w-md">
                  <div className="image flex flex-col justify-between mb-4 gap-4">
                    <img
                      src={user.profilePic.url}
                      alt=""
                      className="w-[180px] h-[180px] rounded-full"
                    />
                    <div className="update w-[250px] flex flex-col justify-center items-center">
                      <input
                        type="file"
                        onChange={changeFileHandler}
                        required
                      />
                      <button
                        className="bg-blue-500 text-white px-3 py-2"
                        onClick={changleImageHandler}
                      >
                        Update Profile
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {showInput ? (
                      <div className="flex justify-center items-center gap-2">
                        <input
                          className="custom-input"
                          style={{ width: "80px" }}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter Name"
                          required
                        />
                        <button onClick={UpdateName}>Update</button>
                        <button
                          onClick={() => setShowInput(false)}
                          className="bg-red-400 text-white p-2 rounded-full"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-800 font-semibold">
                        {user.name}{" "}
                        <button onClick={() => setShowInput(true)}>
                          <CiEdit />
                        </button>
                      </p>
                    )}
                    <p className="text-gray-500 text-sm">{user.email}</p>
                    <p className="text-gray-500 text-sm">{user.gender}</p>
                    <p
                      className="text-gray-500 text-sm cursor-pointer"
                      onClick={() => setShow(true)}
                    >
                      {user.followers.length} follower
                    </p>
                    <p
                      className="text-gray-500 text-sm cursor-pointer"
                      onClick={() => setShow1(true)}
                    >
                      {user.followings.length} following
                    </p>
                    <button
                      onClick={logoutHandler}
                      className="bg-red-500 text-white rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowUpdatePass(!showUpdatePass);
                    if (!showUpdatePass) generateOtp(); // Generate OTP when opening the form
                  }}
                  className="bg-blue-500 px-2 py-1 rounded-sm text-white"
                >
                  {showUpdatePass ? "X" : "Forgot Password"}
                </button>

                {showUpdatePass && (
                  <form
                    onSubmit={updatePassword}
                    className="flex justify-center items-center flex-col bg-white p-2 rounded-sm gap-4"
                  >
                    <input
                      type="text"
                      className="custom-input"
                      placeholder="OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      className="custom-input"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 px-2 py-1 rounded-sm text-white"
                    >
                      Change Password
                    </button>
                  </form>
                )}

                <div className="controls flex justify-center items-center bg-white p-4 rounded-md gap-7">
                  <button onClick={() => setType("post")}>Posts</button>
                  <button onClick={() => setType("reel")}>Reels</button>
                </div>

                {type === "post" && (
                  <>
                    {myPosts.length > 0 ? (
                      myPosts.map((e) => (
                        <PostCard type="post" value={e} key={e._id} />
                      ))
                    ) : (
                      <p>No Post Yet</p>
                    )}
                  </>
                )}
                {type === "reel" && (
                  <>
                    {myReels.length > 0 ? (
                      <div className="flex gap-3 justify-center items-center">
                        <PostCard
                          type="reel"
                          value={myReels[index]}
                          key={myReels[index]._id}
                        />
                        <div className="button flex flex-col justify-center items-center gap-6">
                          {index > 0 && (
                            <button
                              className="bg-gray-500 text-white py-5 px-5 rounded-full"
                              onClick={prevReel}
                            >
                              <FaArrowUp />
                            </button>
                          )}
                          {index < myReels.length - 1 && (
                            <button
                              className="bg-gray-500 text-white py-5 px-5 rounded-full"
                              onClick={nextReel}
                            >
                              <FaArrowDownLong />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p>No Reels Yet</p>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Account;
