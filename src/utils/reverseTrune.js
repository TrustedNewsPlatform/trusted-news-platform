const getReverseTruneResolution = publicKey => {
  return window.localStorage.getItem("reverseTrune:" + publicKey.toLowerCase());
};

const getTruneResolution = async domain => {
  const publicKey = await fetch("https://" + domain + "/trune.txt").then(res =>
    res.text()
  );
  window.localStorage.setItem(
    "reverseTrune:" + publicKey.toLowerCase(),
    domain
  );
  return publicKey;
};

export { getTruneResolution, getReverseTruneResolution };
