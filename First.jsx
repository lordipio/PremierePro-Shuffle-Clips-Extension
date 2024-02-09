function normalShuffle(array) 
{
    for (var i = array.length - 1; i > 0; i--) 
    {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i]
      array[i] = array[j];
      array[j] = temp
    }
}


function shuffleArrayNoConsecutive(arr) {
  var shuffled = [];

  while (arr.length > 0) {
    var randomIndex = Math.floor(Math.random() * arr.length);
    var chosenElement = arr.splice(randomIndex, 1)[0];

    // Ensure no consecutive elements:
    if (shuffled.length > 0 && Math.abs(shuffled[shuffled.length - 1] - chosenElement) === 1) {
      arr.push(chosenElement); // Put back if it creates consecutive elements
      continue; // Try another element
    }
    shuffled.push(chosenElement);
  }

  return shuffled;
}


function shuffleClips()
{
  var seq = app.project.activeSequence;

  var videoTrack = seq.videoTracks[0];

  var audioTrack = seq.audioTracks[0];

  var randomClipsIndex = [];

  var forwardTime = videoTrack.clips[videoTrack.clips.numItems - 1].end.seconds * 2;

  var clipPlacementTime = 0;

  var currentClipInitialPosition = 0;

  var currentClipLength = 0;

  for (var i = 0; i < videoTrack.clips.length; i++)
    randomClipsIndex[i] = i;

  randomClipsIndex = shuffleArrayNoConsecutive(randomClipsIndex);

  for (var i = 0; i < videoTrack.clips.numItems; i++)
  {
      currentClipLength = videoTrack.clips[randomClipsIndex[i]].duration.seconds;

      currentClipInitialPosition = videoTrack.clips[randomClipsIndex[i]].start.seconds;

      forwardTime -= currentClipLength;

      clipPlacementTime = forwardTime - currentClipInitialPosition;
      
      videoTrack.clips[randomClipsIndex[i]].move(clipPlacementTime);

      audioTrack.clips[randomClipsIndex[i]].move(clipPlacementTime);
  }
}


function deleteClipsBelowTreshold(durationTreshold)
{
  var seq = app.project.activeSequence;

  var videoTrack = seq.videoTracks[0];
  
  var audioTrack = seq.audioTracks[0];

  for (var i = 0; i < videoTrack.clips.numItems; i++)
  {
    if (videoTrack.clips[i].duration.seconds < durationTreshold)
    {
      videoTrack.clips[i].remove(1, 1);
      audioTrack.clips[i].remove(1, 1);
      i--;
    }
  }
}


function moveClipsToBegining()
{
  var seq = app.project.activeSequence;

  var videoTrack = seq.videoTracks[0];

  var clipPlacementTime = 0;

  var currentClipInitialPosition = 0;

  var lastClipsLength = 0;

  for (var i = 0; i < videoTrack.clips.numItems; i++)
  {
    currentClipInitialPosition = videoTrack.clips[i].start.seconds;

    clipPlacementTime = -currentClipInitialPosition + lastClipsLength;

    videoTrack.clips[i].move(clipPlacementTime);

    lastClipsLength += videoTrack.clips[i].duration.seconds;
  }
}





deleteClipsBelowTreshold(3);

shuffleClips();

