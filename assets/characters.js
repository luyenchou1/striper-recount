/* =============================================================================
   Tackle Box Rock!  engine/characters.js
   Shared character and prop library for "The Striper Recount". Extends TBR.kit (K).
   Every function returns an SVG string (no <svg> wrapper) drawn around a local
   origin, in flat 70s cel colors from K.C with thick ink outlines. Never animate
   line boil, grain or weave here; the engine adds them.
   STYLE: the two leads follow the 1970s Saturday-morning educational cartoons (big
   clean white oval eyes with crisp black outlines and solid black pupils, no pupil
   highlights, flat colour lids cut by a heavy lid line, simple faces, even outlines).
   Kit's outlines are thinner and more even than the Striper's (KLW 7 silhouette,
   KTW 5.5 sleeves and legs, KDW 4.2 face details); props, backgrounds and the
   Striper's body keep their weights (PW 7, LW 9). The grown-ups (K.grownup and its presets)
   are built on Kit's construction: her eyes, brows, nose, mouths and line weights.

   COMMON OPTIONS (every function below takes one options object)
     x, y      where the local origin lands in the parent space (default 0, 0)
     scale     uniform scale (default 1); line weights scale with it
     rot       rotation in degrees
     flip      true mirrors the drawing so it faces LEFT. Everything is drawn
               facing right by default. Lettering always stays readable.
     squash    squash-and-stretch about the origin: 0.03 = 3% squash (wider and
               shorter), negative = stretch. Use K.beat(T) * 0.03 for the bounce.
   Recommended blink seeds for K.blink(T, seed): Striper 1, Kit 2, School 3 to 5,
   Dot 6, Big Mama 7, voters 8 to 10, householder 11, ramp angler 12. Mouth flaps: pass
   ctx.talking('STRIPER' | 'KID' | 'CHORUS').

   ---------------------------------------------------------------------------
   CHARACTERS
   ---------------------------------------------------------------------------
   K.striper(o)   The hero. About 500 px tall standing (hat included), 490 px nose
     to tail swimming.
     Always: 7 stripes (parallel bands on the silver flank, stopping just behind the
     gill line), mustard bucket hat with brick band tipped back over a forehead band
     with ink brows, the healed hook mark (a short pink slash with two ink
     cross-stitches on his cream lower lip, riding with the jaw), and the stickered
     suitcase (MAINE, CAPE COD, CHESAPEAKE). The lip line runs back under the eye to a
     mouth corner behind and below it, so the expression's corner reads: flat
     (neutral), a long curl up behind the eye (kind, happy, hopeful), the wink's smirk
     (the back half of the upper lip lifts so the corner rides up to the lower eye rim,
     a high curl sweeps back past the eye and a short cheek crease sits under it; it
     holds through talk flaps), dropped (sad) and a forced upturn with teeth (grin).
     The round 'o' (sigh, surprised) sits on the lip line a little back from the snout
     tip. Painters: keep the water or
     sky behind him at sea or lighter, never seaDeep, so his seaDeep back stays clear.
     Origin: on the ground under the forked tail (standing poses); bottom centre
     of the belly for swim and leap; for the lean poses the origin is the top of the
     plank his fins rest on and the body hangs below y = 0: draw the dock plank
     BEHIND him (its top surface at y = 0, i.e. K.dock at y + 16 * scale, running
     forward from about x = 60, or x = -60 when flipped), then him, then water in
     front of his body from about y = 60 down; for 'sit' the ground under the suitcase (he sits on its lid, tail
     flopped over its right end, the handle tucked behind his tail).
     pose     K.STRIPER_POSES: 'neutral' 'talk' 'sing' 'point' 'pointUp' 'pointSelf'
              'shrug' (both fins out past the silhouette at shoulder height, palms up,
              head sunk, inner brow ends lifted; s06 bar 24.5)
              'sad' 'sigh' 'hopeful' 'surprised' 'wink' 'shake' (frame 0|1:
              head swayed back and tipped up, then forward and tipped down, the hat
              counter-tilting) 'photo'
              'tipHat' (the courtesy tip: the near fin travels round the jaw and up in
              front of the snout, the mitten pinches the FRONT brim above the eye, the
              hat lifts clear and tilts forward toward whoever he faces, the head dips
              in a small nod; works with expr 'wink')
              'tipBack' (the fin reaches behind the head and lifts the back brim so the
              hat tips back; s02 bar 5.75, s03 bar 6.0)
              'scratch' (fin under the back of the hat, hat shoved forward over the
              brow, head cocked, two scratch ticks, puzzled face)
              'hatOff' 'heart' 'thumbsUp' 'hold'
              'crank' (frame 0|1|2: three held drawings for the handle at 0, 120 and
              240 degrees; use K.crankStage, or pass reach = the machine's knob)
              'twoStep' (frame 0|1, s04 bar 20)
              'lean' (both fins folded on top of the plank, the near one draped over
              the far one, chin just above them; s02 bar 4, s15)
              'leanTap' (the far fin stays on the plank, the near fin's tip taps the
              hook mark on his lip, s15 bar 76.5)
              'leanTipHat' (the far fin stays on the plank; the near fin comes off the
              plank, arcs out in front of the snout clear of the lips and pinches the
              front brim: the same courtesy tip as 'tipHat'; frame 0 full tip, 1 the
              in-between with the hat half up, 2 the nod; s15 bar 77.0, and with expr
              'wink' for 77.75)
              'sit' (on the suitcase, thumbs up, s13 bar 69.5) 'swim' 'leap' (swim and
              leap lift the hat 5 px and tip it back 5 degrees so the brim clears the
              brow at small sizes). In 'lean' the talk flaps open only to 'mid', so the
              lower lip and band-aid show over the near fin on every drawing.
     expr     K.STRIPER_EXPRS: 'neutral' (lids at half mast) 'weary' 'sigh' 'sad'
              'hopeful' (lids up) 'happy' (his chorus face: a big open oval with a smile
              arch under the pupil) 'kind' 'surprised' 'wink' 'grin' (stiff
              photo grin) 'squint' 'talk' 'sheepish' (the shrug's face: inner brow
              ends up, glance toward camera, hat low) 'puzzled' (the scratch's face:
              one brow up, small frown). Each pose has a default expr. Every
              expression has its own brow shape and hat angle: the brim pulls down for
              weary, sigh and sad and pushes back (and lifts) for hopeful, grin and
              surprised.
     mouth    'open' (with a pink tongue) | 'mid' | 'closed' | false (false = the
              expression's mouth)
     blink    true shuts the eye for this drawing
     THE EYE (70s style, retroEye): one big white oval (0.9 x 1.07 of eyeR 35, so
              about 63 x 75 px, centred where the old round eye was), crisp even ink
              outline, solid black oval pupil with no highlight. Lids are flat silver
              (his head colour) cut by a heavy lid line; lid 0 open .. 1 shut, the
              pupil never rides above the lid or below the cheek. 'sad' tilts the lid
              up at the inner end; happy, kind, puzzled and squint push the cheek up so
              the eye becomes a dome (squint with a flat cheek line); the blink fills
              the oval silver with the lid line hanging low; the wink drops the oval
              for one heavy happy arch (s04's wink ticks at 42 px stay clear of it).
              lid (0..1) overrides the expression's lid for one drawing.
     look     pupil direction: [x, y] each -1..1 (x+ = toward the nose), a number
              for x only, or 'fwd' 'back' 'up' 'down' 'cam' 'upFwd' 'downFwd' 'upBack'
     frame    0 | 1, the two held drawings of 'shake' (kind head shake) and 'twoStep';
              0 | 1 | 2 for 'crank'
     reach    [x, y] in the parent space: the near fin's palm lands exactly there
              (the crank knob; any pose)
     phase    0..1 body wave for 'swim' and 'leap'
     suitcase true (default: where the pose puts it) | false | 'near' | 'far'
              (in that fin) | 'ground' (beside him) | 'under' (sitting on it)
     hat      true (default) | false | 'off' (bare head). 'hatOff' holds it in the fin.
     hatTilt  extra degrees on the hat; hatPage true tucks the stamped ledger page
              into the hat band (s02 to s03)
     hold     what the near fin holds: 'pencil' (THE COUNT, held up and away from the
              snout) | 'card' (held up beside the head, clear of the eye and mouth) |
              'hat' | 'counter' (tally counter) | any SVG string (drawn at the fin,
              origin = palm). holdText sets the card text (default 'x 5'); sharp 0..1
              and ting (sparkle) pass to the pencil. Use pose 'hold' for card and
              pencil while singing.
     q        true pops a brick '?' over his head
   K.striperPoints(o) -> {eye, nose, hat, near, far, belly, hook, seat, shoulder}:
     points in the parent space for the same {x, y, scale, flip, rot, pose, frame, expr,
     mouth, reach} (near and far are the fin palms; hook is the scar on the lower lip,
     following the jaw for the given mouth flap; seat is the suitcase lid; shoulder is
     where the near fin grows from).
   K.crankStage({machine, x, y, scale, frame})  the standard crank set-up on THE
     MULTIPLIER (machine 'multiplier', default) or the wall sharpener ('sharpener'),
     both drawn at {x, y, scale}. Returns {crank, knob, striper}: pass crank to the
     machine and striper (add mouth, blink, expr) to K.striper. He faces the machine
     from its crank side (flip), the hub 208 px in front of him; his palm lands on the
     knob in all three frames (crank = frame / 3).
   K.bucketHat({page})   the hat alone (canvas brim sloping down at both ends);
     origin = centre of the band's bottom edge.
   K.suitcase({stickers, handle})  the tackle-box suitcase; origin = top of the
     handle; 190 x 128 at scale 1 (carried at about 0.62, sat on at 1.05).
     handle false drops the handle, 'only' draws just the handle.

   K.kid(o)   Kit, about 12, speaks only. About 550 px tall to the pom-pom, drawn
     in the 70s Saturday-morning style: a big round face (about 150 x 146 px) sitting
     straight on the shoulders with no neck, so face and cap are about 1:2.5 of her
     height; a stubby rounded A-line slicker, short brown corduroy legs and chunky
     tall-shafted rubber boots; thin even outlines (KLW).
     Face: two tall white oval eyes set close together (near 26 x 41, far 24 x 40,
     centres fixed at head-frame [4, 10] and [36, 8]; s09 paints its own slow deadpan
     lid over them) with clean ink outlines and solid black oval pupils that aim with
     look and may press right up to the rim; simple arched ink brows under the cap
     cuff; a round nub nose tucked against the far eye's lower rim; freckles across
     both cheeks; a C ear; brown hair flipping out under the cap; line mouths and
     simple open mouths with the gap tooth and a pink tongue.
     Always the orange pom-pom watch cap (yarn-tick pom-pom) with the red-and-white
     bobber pinned to the front of its cuff above the outer corner of her near eye
     like a lure on a hat band (her permanent angler's mark), avocado slicker with
     mustard toggles, brick boots, freckles, ink brows, gap-tooth grin.
     Origin: ground between the boots (for 'belly': the planks under her chest).
     pose     K.KID_POSES: 'neutral' 'talk' 'point' (use aim) 'pointBack' 'cheeks'
              (hands on cheeks) 'cheer' 'wave' 'scratch' (frame 0|1: the elbow swings out
              past her far cheek and the mitten lands on top of the cap cuff; eyes, nose
              and mouth stay clear, s05)
              'think' (one finger up) 'wait' (index finger raised in front of her
              face, s08) 'shrug' 'fishOn' (rod bent) 'rod' 'camera'
              'photo' 'fork' (fork raised like a torch, napkin on; s10) 'stab'
              (frame 0 wind-up with eyes on the old rim, both sleeves behind her head so
              only the fists and fork show and her face stays clear; frame 1 the lunge: body
              pitched 18 degrees, arms fully out, both fists on the handle, tines
              leading forward and down 30 degrees off vertical, back boot kicked up,
              speed lines and a brick impact star at the tines (impact: false hides
              those two); s09 bar 44.25; stage it with K.picnicTable({top}) so the
              tines land inside the pie's ghost ring) 'stamp' 'push' 'binoculars'
              'cradle' (both palms up in front, near hand forward at his tail root, far
              hand under his belly; use hold 'striper', s02 bar 3.0)
              'holdUp' 'nod' (frame 0|1, s12 bar 59) 'twoStep' (frame 0|1, s04 bar 20)
              'crouch' (a squat, hands on knees) 'crouchPhoto' (crouched holding up
              the photo, s15) 'kneel'
              'belly' (on her belly on the planks, knees bent, boots up and crossed,
              elbows planted, chin in hands; s02 bar 4)
     expr     K.KID_EXPRS: 'neutral' 'talk' 'grin' (huge, smiling dome eyes)
              'wide' (bigger ovals that touch, small pupils, high brows, O mouth)
              'tilt' (head tilt, use q for the '?') 'deadpan' (heavy flat lids at half
              mast, look to camera) 'worried' (inner brow ends raised, lids tilted up
              at the inner ends, wavy mouth) 'happy' (eyes shut in happy arches)
              'think' 'sad' (droopy tilted lids) 'eager' (wide eyes, grin) 'kind'
              (smiling dome eyes: the cheeks push the lower lids up in an arch)
              'fall' (the tilt with the smile gone flat, lids a little low; s08)
     mouth, blink, look   as for the Striper (x+ = toward her facing direction);
              a 'closed' flap always closes the mouth; the blink keeps each oval,
              filled with skin, the lid line hanging low.
     tilt     head tilt in degrees (overrides the expression's tilt)
     frame    0 | 1 for the two-drawing poses above
     aim      degrees for pose 'point': 0 = straight ahead, -90 = up, 30 = down
     hold     override the pose's prop: 'rod' 'rodBent' 'camera' 'photo' 'fork'
              'forkUp' 'forkDown' (stab grips; the fork is one prop size, about 200 px,
              in every fork drawing) 'stamp' 'binoculars', 'striper' (the Striper
              held flat across her forearms, belly on her palms, head toward her,
              under her near arm and over her far arm; fish = options for K.striper,
              default {pose 'swim', expr 'weary', look 'upFwd', hatTilt 18, suitcase
              'near', scale 0.55: his scale in her arms}), any SVG string
              (at the near hand), or null
     rodBend 0..1, flash (camera flash burst), napkin (bool),
     stampLabel / stampColor (default 'RECOUNT', orange), q ('?' over the cap)
   K.kidPoints(o) -> {head, eye, mouth, near, far, top} in the parent space (eye =
     midway between the two eyes, mouth = the mouth centre, 5 px lower than before the
     70s restyle; head, eye, top and the hands are unchanged), plus
     tines (fork tips, for 'stab' frame 1) and photo (photo centre, for 'photo' and
     'crouchPhoto').

   K.schoolie(o)   One juvenile striper, half the hero's size, 4 stripes, bow tie
     (drawn under the chin on top of the fins so the tie order always reads).
     pose K.SCHOOL_POSES: 'neutral' 'sing' 'jazz' (jazz fins) 'shake' (use frame)
     'toast' 'raise' (the toast lifted high: far fin overhead, near fin down) 'peek' (fins gripping a
     table edge) 'swim' 'leap'. tie 0 | 1 | 2
     (mustard, orange, avocado), a color, or false (no bow tie). expr 'neutral' 'sing' 'happy' 'shut'
     'surprised'. The School shares the Striper's 70s eye (white oval, solid pupil,
     silver lids; 'shut' is the happy arch). The round singing mouth sits down and back under the snout; the
     closed mouth is a short line. mouth, blink, look, frame, phase as above.
     Origin: ground.
   K.school(o)   The trio in fixed tie order left to right (mustard, orange,
     avocado), kept even when flipped. T = global seconds: each fish bobs on
     K.beat one beat after the last. bob 0..1 bob height, gap (px, default 240),
     poses / mouths / frames = arrays of 3, or pose / mouth for all; blink true
     blinks each fish on its own seed. Origin: the middle fish's ground point.
   K.bowTie({color})   the School's bow tie alone.

   THE GROWN-UPS (one shared figure on Kit's construction)
   K.grownup(o)   The shared adult. Kit's face at her sizes and line weights: two tall white
     ovals (near 26 x 41, far 24 x 40) with solid black pupils and no highlight, skin-colour
     lids cut by a heavy lid line, her arched ink brows, a round nub nose, her simple mouths
     (at KDW, without her gap tooth) and a C ear, on a longer adult face (about 168 x 180,
     the head about a quarter of the height). Tapered sleeves end in mittens; the legs have a
     two-drawing walk. People differ only by silhouette, skin, hair, clothes and one
     accessory (no freckles, bucket hats or pom-pom caps: those are the leads'). Faces
     right; origin on the ground between the feet. o carries the look and the stance, plus
     the common options:
       skin      C.tan | C.brown | C.sand
       hy        head centre y (default -590); the face runs from hy - 90 to hy + 90, the
                 hair adds 10 to 150 px on top
       face      [rx, ry] (default [84, 90]); sw shoulder half-width (60); belly px
       hair      'bun' 'fringe' 'flip' 'afro' 'tuft' 'cap' 'none'; hairFill, capFill
       top       'windbreaker' 'cardigan' 'coat' 'turtleneck' 'robe' 'jacket'; topFill, hem
       legs      'slacks' 'flares' 'bare' 'waders'; legFill, legW
       shoes     'shoe' 'slipper' 'boot'; shoeFill
       acc       a list from 'visor' 'glasses' 'earPencil' 'patch' 'mustache' 'fishPatch'
       near, far the arms: [dx, dy, hand, handRot, bend, via, handDir] from that shoulder,
                 or {at: [x, y], hand, dir, bend, via} in standing coordinates; hand 'fist'
                 'open' 'point' 'thumb'; via = an elbow the sleeve passes through
       walk      0 | 1 the walk drawings (0: far foot forward, near foot back; 1: passing,
                 the near foot lifted behind, body up 10 px); null or absent = standing
       expr      K.GROWNUP_EXPRS: 'neutral' 'talk' 'kind' 'happy' 'wide' 'curious' 'think'
                 'worried' 'plain'
       mouth, blink, look, tilt   as for Kit (a 'closed' flap always closes the mouth; the
                 'happy' grin holds through the flaps)
       farOnTop  the far arm over the body
     Recommended blink seeds: voters 8, 9, 10; householder 11; ramp angler 12.
   K.dot(o)   Dot the Surveyor (non-speaking), a grown-up preset about 695 px tall to the top
     of her bun: brown skin, gray bun, mustard visor, orange glasses framing the tall ovals,
     sky windbreaker with a cream name patch (no lettering), olive slacks, brown shoes. She
     holds the clipboard at chest height, well below her chin, with both mittens on it.
     pose 'clipboard' (pencil behind her ear; the far mitten on the left edge, the near
     mitten on the lower right corner) | 'tap' (the near fist brings the pencil down on the
     page, frame or tapFrame 0 up, 1 down; the far mitten holds the left edge). mouth,
     blink, look, expr. Origin: ground.
   K.dotPoints(o) -> {clip, clipTop, head, eye, hand} in the parent space for the same {x, y,
     scale, flip, rot, pose, frame}: clip = the clipboard's centre (the page; standing
     coordinates [124, -392] in both poses), clipTop = the top centre of its mustard clip
     (hang a tag from here), head = the head centre, eye = midway between the eyes, hand =
     the near mitten's palm (the pencil hand in 'tap').
   K.voter(o)   The exit-poll voters: three grown-up presets keyed by color. C.sky = a tall
     man (about 730) with a gray fringe and a push-broom mustache, sky cardigan, gray slacks;
     C.orange = a woman (about 690) with a mustard flip, an orange coat and a brown handbag in
     her near mitten (the voter Dot polls); C.avocado = a younger man (about 725) with a round
     ink hairdo and sideburns, avocado turtleneck, sky-deep flares. Any other color draws the
     sky man. frame 0 | 1 = the two-drawing walk with the arms swinging; pose 'stand' holds
     still with the arms at the sides; lookX (px, as before) or look aims the pupils; mouth,
     blink, expr. Origin: ground.
   K.householder(o)   A home angler at his mailbox, about 645 px to the tip of his cowlick,
     facing right: sand skin, brown bed-head, a brick bathrobe with a cream fish on the
     pocket, bare shins and mustard slippers. No lettering on the figure.
     pose 'mail' (both mittens hold the opened letter at his chest; frame 1 lifts it 8 px) |
     'read' (elbow at his side, the pencil up in the near fist, far mitten on his belly, eyes
     forward and down on the form; frame 1 nods the pencil) | 'think' (the pencil tip at his
     chin, his near elbow resting on the far forearm across his belly, eyes up; frame 1 taps
     the chin). look, blink, mouth, expr. Origin: ground between the slippers.
   K.rampAngler(o)   An angler just off the water, about 660 px to the top of his cap (the rod
     tip reaches 706), facing right: tan skin, sea ball cap, orange rain jacket, olive chest
     waders with suspenders and boots, the rod resting on his far shoulder (the far mitten
     grips it at his chest; it runs back behind his head, clear of the face).
     pose 'stand' (near mitten at his side) | 'talk' (elbow at his side, open palm up) |
     'point' (the near arm aims a pointing mitten forward and down: aim = degrees below
     level, default 24; aim it at a cooler). frame 0 | 1: a small move of the near hand.
     look, blink, mouth, expr. Origin: ground. K.HOUSEHOLDER_POSES and K.RAMP_POSES list the
     poses.
   K.bigMama(o)   1.4x the Striper, rounder cream belly, EGGS ON BOARD dart tag. The family's
     70s eye (white oval, solid pupil, silver lids) at 0.9 of its size, three ink lashes
     fanned from the lid line's back corner, her own low brow inside the head outline, pink
     cheek; a narrow orange dotted headscarf over the crown and down behind the eye (silver
     head shows between them), knotted under her chin behind and below the mouth, so nothing
     crosses her eye, brow or mouth. pose 'glide' | 'chinUp'. phase, mouth, blink, look;
     tagScale enlarges the fin tag (default 1). Origin: bottom centre of the belly.

   ---------------------------------------------------------------------------
   PROPS (origin noted for each; all accept the common options)
   ---------------------------------------------------------------------------
   Title and dock
   K.tackleBox({open, trays})  open 0 closed, 0.3 first held drawing, 1 fully open;
       trays 0..1 fan up and right like steps. Origin: bottom centre, 360 wide.
   K.logo({spin, spring})  TACKLE BOX ROCK! starburst (magenta rim lives only
       here). spring = px of coiled spring drawn below it. Origin: centre.
   K.piling({h, r})  wooden piling with rope wrap. Origin: bottom centre.
   K.dock({w, h, legs, legH})  plank deck; legs = x positions of pilings. Origin:
       top-left of the deck's front edge (deck top surface is y -16..0).
   K.gull({flap})  white M gull, flap 0..1.   K.lighthouse({h})  origin bottom.
   K.rod({angle, bend, len})  rod with reel, line and bobber; origin = butt.
   K.bobber({})  red and white bobber.   K.fork({})  origin = handle end.
   K.camera({flash})  instant camera with flash cube; origin centre.
   K.photo({caption})  the square snapshot from s02 bar 3.75: the Striper standing
       upright in the 'photo' pose with the stiff grin, facing left as Kit's camera saw
       him from screen-left (set him down on the planks in
       that pose for the shot, so the s15 photo matches what was taken); origin centre.
   K.binoculars({})  origin centre.
   Stamps and paper
   K.stamp({label, color, squash})  rubber stamp; origin = bottom of the rubber
       face. squash 0.2 for the impact drawing.
   K.stampMark({label, color, size, w, rot})  the inked imprint; origin centre.
   K.ledger({stamps, w, h})  catch-record page; stamps = ['COUNTED', 'RECOUNTED']
       or [{label, color}]. Only ever stamp paper, never a fish. Origin centre.
   K.card({label, w, h, size, font, chars, fill, color, style})  cream card;
       style 'plain' | 'corrected' (sea with cream check) | 'ghost' (gray dashed).
   K.sign({label, w, h, fill, color, size, font, post, postH, dashed})  sign board
       on a 'post' | 'stake' | 'none'. Origin: ground under the post.
   K.tallyBoard({label, notches, notch, drop, w})  board on a notched stake;
       drop = notches it has slid down. Origin: ground.
   Surveys (s03, s06, s07)
   K.mailbox({flag, door})  flag 0 down .. 1 up; origin: bottom of the post.
   K.envelope({open})  the mail survey letter; origin centre.
   K.form({title, lines, tally, w, h, border})  paper form; tally = marks;
       border 'old' (gray dashed) | 'new' (sea). Origin: top centre.
   K.clipboard({lines, fish, w, h})  origin centre.
   K.tallyCounter({count})  hand tally counter; origin centre.
   K.cooler({open, label, spring, card})  brick cooler with cream lid; the label
       is lettered on a cream plate on the FRONT so it stays readable when the lid
       pops; spring 0..1 raises a jack-in-the-box card (default '0'). Origin:
       bottom centre.
   K.voteBooth({curtain, label})  s03 exit-poll booth: cream booth, seaDeep curtain
       lettered VOTE; curtain 0 closed .. 1 drawn aside (the VOTE tag moves to the
       roof). About 400 x 726. Origin: bottom centre.
   K.multiplier({crank, labels, card, cardLabel, cardStyle, cardGhost})  THE
       MULTIPLIER. crank 0..1 turns the handle and wheels; labels true or
       {left, right} shows the TRIPS and FISH PER TRIP funnel tags; card 0..1
       slides the output card out (cardStyle as K.card, cardGhost draws the old
       card's gray dashed ghost). Origin: bottom centre. K.MULT gives its local
       funnelL, funnelR, slot and crank (hub) points (multiply by scale) and
       K.MULT.knob(crank) the knob; K.multiplierKnob({x, y, scale, flip, crank}) is
       the knob in the parent space (aim the Striper's reach there).
   K.tripToken({kind, ghost, stray, r})  mustard trip token with a boat
       ('boat') or rod-in-sand ('rod') icon; stray = gray dashed rim;
       ghost = gray dashed, no fill. Origin centre.
   K.calendar({label, w, h, rows, string, border, stickers})  paper page with a
       brick header; string = hanging string length; stickers = [[x, y, r,
       'stray' | 'ghost']]. Origin: the hanging point (top centre).
   K.calendarTabs({tabs, active, w})  the six two-month tabs; origin bottom centre.
   K.chalkboard({w, h, title, titleSize, easel, legH})  olive board on a brown
       easel. Origin: ground centre; board top-left = (-w/2, -legH - h).
   K.ledgerScroll({w, h, legH, unroll, extra})  s07 long paper ledger scroll on a
       brown easel: scribbled rows and a column of fish icons (the catch record);
       unroll 0..1 rolls the left end out by extra px (default 820) with small
       unlabeled year ticks. Stamp CORRECTED on it with K.stampMark. Origin: ground
       centre of the easel; paper top = -legH - h.
   The count, the school and the pie
   K.fishIcon({size, fill})  silver fish icon (90 px long); origin centre.
   K.estimatedSchool({tight, ghost, n, seed, w, h, fishSize, minScale, label, fill})
       the ESTIMATED SCHOOL: a big-fish chalk outline with a fixed cluster of n
       fish. tight 0 = sky outline at full size; tight > 0 redraws it smaller in
       sea and leaves the gray dashed ghost at the old size. The fish never move.
       fill (default none) paints inside the current outline (never the ghost),
       for a busy background such as the s14 horizon.
   K.pencil({len, sharp, label, ting, mirrorText})  giant THE COUNT pencil
       pointing right; sharp 0 blunt .. 1 needle. Origin centre.
   K.sharpener({crank})  wall pencil sharpener; origin centre. K.SHARP.knob(crank)
       (local) and K.sharpenerKnob({x, y, scale, flip, crank}) (parent space) give
       the crank knob.
   K.pie({r, crust, lift, liftH, slice, ghostSlice, ghostRim, sliceAt})  the
       ESTIMATED SCHOOL pie in its tin, five slices. lift 0..1 raises one slice
       (orange filling); slice < 1 redraws it smaller inside a gray dashed ghost;
       crust < 1 shrinks the pie in place; ghostRim keeps the old rim. covered true
       draws the s08 covered tin (silver dome with a knob). Origin centre.
   K.pieServer({})  s09 pie server: brown handle, offset neck, flat triangular blade
       squared at the heel, serrated underneath, one highlight. Origin: handle end,
       blade pointing right.
   K.picnicTable({w, h, top, taper, legH})  brick and cream checkered cloth; origin
       top centre (the front edge). top = depth of the tabletop plane in px (checks
       foreshortened at K.TABLE_K = 0.52, the pie's ratio; back edge narrowed by taper,
       default 0.12); the cloth folds over the front edge and hangs h px, legs legH
       below the hem. Without top it is the old front elevation. For s09 make top
       deep enough that the pie's ghost ring sits on the cloth with 30 px to spare
       (pie at 0.78: top 330, w 640).
   K.gauge({label, text, value, r, postH})  round gauge on a post; origin ground.
   Commercial share (s11, s12)
   K.stack({n, ghosts, color, bw, bh, postH, headroom, shade, tag})  framed panel
       of plain blocks on a post; the top `ghosts` blocks are gray dashed ghosts
       (blocks never fall off). shade 0..1 pulls the roller shade down. Use
       different bw, bh and postH for the two frames. Origin: ground under post.
   K.arrow({len, w, color, dashed})  block arrow pointing right from its tail
       (rot -90 points up); dashed = thin dashed arrow. Origin: tail.
   K.gillnet({w, h, mesh})  float line, mesh and lead line; origin top centre.
   The ladder of steps (s13, s14)
   K.ladder({n, stepW, stepH, labels, lettered, checks, q, signs, signScale, signPostH, topSign, layer})
       fish ladder of stepped cream-stone pools rising left to right, each with a
       brown numbered sign (signPostH raises the signs, default 90, to clear a fish sitting
       in a pool) and a cascade spilling into the pool below;
       lettered[i] letters sign i in, checks[i] adds its check, q puts the brick
       '?' on the last unlettered sign. Above the top pool calm river water runs on
       past the sign topSign (default 'UPRIVER TO SPAWN'; false hides it). Pool i
       spans x = i*stepW .. (i+1)*stepW with its water at y = -(i+1)*stepH - 14 (the
       surface line; the pool floor under the lip is about 60 px lower). layer 'back' draws
       the stone steps, pools, river and signs; layer 'front' draws only the pools' water,
       stone lips and cascades, so a fish drawn between the two sits in the water (draw
       back, then the fish, then front with the same options). Keep a wide shot of the
       whole ladder at scale 0.85 or larger so UPRIVER TO SPAWN (36 px) stays readable.
       Origin: bottom-left.
   K.poolSign({num, label, lettered, check, q, w, h, postH, size})  one sign.
   K.stockPot({steam})  the Commission's pot; origin bottom centre (rim at y -250).
   K.ingredient({kind, label})  s13 pot ingredients: 'can' (sea can, CORRECTED
       COUNT), 'jar' (glass jar, NEW RELEASE DEATH RATE), 'box' (cardboard box,
       MAYBE A NEW MATH MODEL (WHAM)); label overrides. Origin: bottom centre.
   K.magnifier({blink, look})  s13 peer reviewer: giant magnifying glass with
       cartoon eyes in the lens. Origin: bottom of the handle, lens up.
   K.reviewers({blinks, T, gap})  the three reviewers leaning in; blinks = [b0, b1,
       b2], or T (global seconds) to blink them one after another on the beat.
       Origin: the middle glass's handle end.
   K.boardTable({w, chairs, gavel, scroll, scrollText})  empty Board table, gavel
       resting (there is no strike drawing), blank scroll. Origin: floor centre.
   Effects and marks
   K.thought({w, h, stage, tail, inner})  thought bubble; stage 1, 2, 3 inflates
       it (dot, bigger dot, cloud); tail = [dx, dy] toward the thinker; inner =
       SVG drawn around the bubble centre and clipped inside it. Origin centre.
   K.swimSchool({n, w, h, size, seed, T})  about twenty simple stripers (no bow ties)
       swimming right together, the s14 SOMEDAY wish: pass it as a thought bubble's
       inner, never the ESTIMATED SCHOOL outline. Origin centre.
   K.ghostBoat({})  dashed gray ghost boat with a face (s07 only ghosts).
   K.puff({r, seed, fill})  cream puff cloud.   K.splash({n, r, p, fill})  cream
   teardrops flying up from the origin (p 0..1 spread).   K.sparkle({r})  white
   TING star.   K.speedLines({len, n, gap, w})  trailing to the left of origin.
   K.impact({r, n, fill, spin})  impact star.   K.qmark({size, color})  brick '?'.
   K.check({color})  cream check.   K.xmark({color})  brick X.
   ============================================================================= */
(function () {
  'use strict';
  var TBR = window.TBR = window.TBR || {};
  var K = TBR.kit = TBR.kit || {};
  var C = K.C;
  var INK = C.ink;
  var LW = 9;      // character silhouette line
  var PW = 7;      // props and backgrounds (K.INK_W)
  var DW = 4.5;    // stripes, fin rays, freckles, small details
  var hash = function (n) { return TBR.hash ? TBR.hash(n) : (Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1; };

  /* ---------- tiny SVG helpers ---------- */
  function N(v) { return Math.round(v * 10) / 10; }
  function P(x, y) { return y === undefined ? N(x[0]) + ',' + N(x[1]) : N(x) + ',' + N(y); }
  var RJ = ' stroke-linejoin="round" stroke-linecap="round"';
  function paint(fill, sw, stroke, extra) {
    return ' fill="' + (fill || 'none') + '"' + (sw ? ' stroke="' + (stroke || INK) + '" stroke-width="' + sw + '"' + RJ : '') + (extra || '');
  }
  function path(d, fill, sw, extra, stroke) { return '<path d="' + d + '"' + paint(fill, sw, stroke, extra) + '/>'; }
  function circ(cx, cy, r, fill, sw, extra) { return '<circle cx="' + N(cx) + '" cy="' + N(cy) + '" r="' + N(r) + '"' + paint(fill, sw, null, extra) + '/>'; }
  function ell(cx, cy, rx, ry, fill, sw, rot, extra) {
    return '<ellipse cx="' + N(cx) + '" cy="' + N(cy) + '" rx="' + N(rx) + '" ry="' + N(ry) + '"' + paint(fill, sw, null, extra) +
      (rot ? ' transform="rotate(' + N(rot) + ' ' + N(cx) + ' ' + N(cy) + ')"' : '') + '/>';
  }
  function line(x1, y1, x2, y2, sw, stroke, extra) {
    return '<path d="M' + P(x1, y1) + ' L' + P(x2, y2) + '"' + paint('none', sw || DW, stroke, extra) + '/>';
  }
  function rect(x, y, w, h, r, fill, sw, extra, stroke) {
    return '<rect x="' + N(x) + '" y="' + N(y) + '" width="' + N(w) + '" height="' + N(h) + '" rx="' + N(r || 0) + '"' + paint(fill, sw, stroke, extra) + '/>';
  }
  function g(inner, tr) { return tr ? '<g transform="' + tr + '">' + inner + '</g>' : '<g>' + inner + '</g>'; }
  function lab(str, x, y, size, o) { o = o || {}; o.size = size; return K.text(str, x, y, o); }
  var DASH = ' stroke-dasharray="14 10"';
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var rad = Math.PI / 180;
  function rot(p, a) { var c = Math.cos(a * rad), s = Math.sin(a * rad); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function len(a) { return Math.sqrt(a[0] * a[0] + a[1] * a[1]); }
  function ang(a) { return Math.atan2(a[1], a[0]) / rad; }

  /* Catmull-Rom spline through points, as cubic Beziers. */
  function smooth(pts, closed, k) {
    var n = pts.length; if (n < 2) return '';
    k = (k == null ? 1 : k) / 6;
    var d = 'M' + P(pts[0]), last = closed ? n : n - 1;
    for (var i = 0; i < last; i++) {
      var p0 = pts[closed ? (i - 1 + n) % n : Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[closed ? (i + 2) % n : Math.min(i + 2, n - 1)];
      d += ' C' + P(p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k) + ' ' + P(p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k) + ' ' + P(p2);
    }
    return d + (closed ? ' Z' : '');
  }
  /* Slightly wobbly ellipse: 70s hand-inked circles, never perfect. */
  function blobPts(cx, cy, rx, ry, seed, wob, n) {
    n = n || 8; var pts = [];
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2, r = 1 + (hash(seed * 13.7 + i * 3.1) - 0.5) * 2 * (wob == null ? 0.035 : wob);
      pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
    }
    return pts;
  }
  function blob(cx, cy, rx, ry, seed, wob, n) { return smooth(blobPts(cx, cy, rx, ry, seed, wob, n), true); }
  /* Union silhouette: ink pass (fat stroke) then color pass, so overlapping
     primitives read as one inked shape with no inner lines. */
  function union(shapes, fill, sw) {
    var s = shapes.join('');
    return '<g fill="' + INK + '" stroke="' + INK + '" stroke-width="' + (2 * sw) + '"' + RJ + '>' + s + '</g><g fill="' + fill + '">' + s + '</g>';
  }
  /* A stroked tube with an ink outline (sleeves, rods, handles). */
  function tube(d, w, fill, sw) {
    return '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + N(w + 2 * sw) + '"' + RJ + '/>' +
      '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + N(w) + '"' + RJ + '/>';
  }
  /* Standard placement wrapper. flip mirrors so the figure faces left. */
  function place(o, inner) {
    var s = o.scale == null ? 1 : o.scale, sx = s * (o.flip ? -1 : 1), sy = s;
    if (o.squash) { sx *= 1 + o.squash * 0.6; sy *= 1 - o.squash; }
    var tr = 'translate(' + N(o.x || 0) + ' ' + N(o.y || 0) + ')' + (o.rot ? ' rotate(' + N(o.rot) + ')' : '') +
      (sx !== 1 || sy !== 1 ? ' scale(' + (Math.round(sx * 1000) / 1000) + ' ' + (Math.round(sy * 1000) / 1000) + ')' : '');
    return '<g transform="' + tr + '">' + inner + '</g>';
  }
  /* Inside a flipped figure, draw lettered things mirrored back so they read. */
  function unflip(inner, flip, cx, cy) {
    if (!flip) return inner;
    cx = cx || 0; cy = cy || 0;
    return '<g transform="translate(' + N(cx) + ' ' + N(cy) + ') scale(-1 1) translate(' + N(-cx) + ' ' + N(-cy) + ')">' + inner + '</g>';
  }
  function lookVec(look) {
    if (look == null) return [0.35, 0.05];
    if (typeof look === 'number') return [look, 0];
    if (Array.isArray(look)) return [+look[0] || 0, +look[1] || 0];
    if (typeof look === 'object') return [look.x || 0, look.y || 0];
    return ({ fwd: [0.7, 0], back: [-0.7, 0], up: [0.2, -0.75], down: [0.2, 0.7], cam: [0, 0], upFwd: [0.55, -0.55], downFwd: [0.55, 0.5], upBack: [-0.5, -0.55] })[look] || [0.35, 0.05];
  }
  function mouthState(m) { return m === 'open' || m === 'mid' || m === 'closed' ? m : false; }

  /* ---------- fish rig: a spine curve with a width profile ---------- */
  function cub(Pt, t) {
    var u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    return [a * Pt[0][0] + b * Pt[1][0] + c * Pt[2][0] + d * Pt[3][0], a * Pt[0][1] + b * Pt[1][1] + c * Pt[2][1] + d * Pt[3][1]];
  }
  function cubD(Pt, t) {
    var u = 1 - t;
    return [3 * u * u * (Pt[1][0] - Pt[0][0]) + 6 * u * t * (Pt[2][0] - Pt[1][0]) + 3 * t * t * (Pt[3][0] - Pt[2][0]),
      3 * u * u * (Pt[1][1] - Pt[0][1]) + 6 * u * t * (Pt[2][1] - Pt[1][1]) + 3 * t * t * (Pt[3][1] - Pt[2][1])];
  }
  function table(tab) {
    var n = tab.length, m = [];
    for (var i = 0; i < n; i++) { var a = tab[Math.max(i - 1, 0)], b = tab[Math.min(i + 1, n - 1)]; m[i] = (b[1] - a[1]) / ((b[0] - a[0]) || 1); }
    return function (s) {
      s = clamp(s, tab[0][0], tab[n - 1][0]);
      var i = 0; while (i < n - 2 && s > tab[i + 1][0]) i++;
      var a = tab[i], b = tab[i + 1], h = b[0] - a[0], t = (s - a[0]) / h, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * a[1] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * b[1] + (t3 - t2) * h * m[i + 1];
    };
  }
  /* A spine can be one cubic (4 points) or a chain of cubics (3n+1 points). */
  function segOf(ctrl, t) {
    var n = Math.max(1, Math.round((ctrl.length - 1) / 3));
    if (n === 1) return { c: ctrl, t: t };
    var u = clamp(t, 0, 1) * n, i = Math.min(Math.floor(u), n - 1);
    return { c: ctrl.slice(i * 3, i * 3 + 4), t: u - i };
  }
  function cubN(ctrl, t) { var q = segOf(ctrl, t); return cub(q.c, q.t); }
  function cubND(ctrl, t) { var q = segOf(ctrl, t); return cubD(q.c, q.t); }
  function Rig(ctrl, wb, wv) {
    var M = ctrl.length > 4 ? 150 : 90, pts = [], L = [0], i;
    for (i = 0; i <= M; i++) { pts.push(cubN(ctrl, i / M)); if (i) L.push(L[i - 1] + len(sub(pts[i], pts[i - 1]))); }
    var total = L[M];
    function tOf(s) {
      var target = clamp(s, 0, 1) * total, j = 1;
      while (j < M && L[j] < target) j++;
      var f = (target - L[j - 1]) / ((L[j] - L[j - 1]) || 1);
      return (j - 1 + f) / M;
    }
    var r = {
      L: total, wb: wb, wv: wv,
      p: function (s) { return cubN(ctrl, tOf(s)); },
      T: function (s) { var d = cubND(ctrl, tOf(s)), l = len(d) || 1; return [d[0] / l, d[1] / l]; },
      at: function (s, q) {
        var p = r.p(s), T = r.T(s), B = [T[1], -T[0]], w = q < 0 ? -q * wb(s) : -q * wv(s);
        return [p[0] + B[0] * w, p[1] + B[1] * w];
      },
      ang: function (s) { return ang(r.T(s)); },
      /* local frame at spine point s: x along the spine (toward the nose), y toward the belly */
      fr: function (s, q, x, y) {
        var o = r.at(s, q || 0), T = r.T(s), D = [-T[1], T[0]];
        return [o[0] + T[0] * x + D[0] * y, o[1] + T[1] * x + D[1] * y];
      }
    };
    return r;
  }
  function edge(rig, q, s0, s1, n) {
    var pts = []; n = n || 24;
    for (var i = 0; i <= n; i++) pts.push(rig.at(lerp(s0, s1, i / n), q));
    return pts;
  }
  function band(rig, q0, q1, s0, s1) {
    var a = edge(rig, q0, s0, s1, 30), b = edge(rig, q1, s0, s1, 30).reverse();
    return smooth(a, false) + ' L' + P(b[0]) + smooth(b, false).replace(/^M[^C]*/, '') + ' Z';
  }
  function bandQ(rig, qf0, qf1, s0, s1) {
    var a = [], b = [], m = 40;
    for (var i = 0; i <= m; i++) { var s = lerp(s0, s1, i / m); a.push(rig.at(s, qf0(s))); b.push(rig.at(s, qf1(s))); }
    b.reverse();
    return smooth(a, false) + ' L' + P(b[0]) + smooth(b, false).replace(/^M[^C]*/, '') + ' Z';
  }
  /* A fin along the back (side -1) or belly (side +1) between s0 and s1. */
  function finAlong(rig, s0, s1, side, hs, sweep, spiny) {
    var n = hs.length, out = [], base = edge(rig, side * 0.72, s0, s1, 10);
    for (var i = n - 1; i >= 0; i--) {
      var s = lerp(s0, s1, i / (n - 1)), T = rig.T(s), B = [T[1], -T[0]], nr = side < 0 ? B : mul(B, -1), e = rig.at(s, side);
      out.push(add(add(e, mul(nr, hs[i])), mul(T, -hs[i] * (sweep || 0.35))));
      if (spiny && i > 0) {
        var sm = lerp(s0, s1, (i - 0.5) / (n - 1)), Tm = rig.T(sm), Bm = [Tm[1], -Tm[0]], nm = side < 0 ? Bm : mul(Bm, -1), hm = (hs[i] + hs[i - 1]) * 0.28;
        out.push(add(add(rig.at(sm, side), mul(nm, hm)), mul(Tm, -hm * (sweep || 0.35))));
      }
    }
    var d = 'M' + P(base[0]) + base.slice(1).map(function (p) { return ' L' + P(p); }).join('') +
      (spiny ? out.map(function (p) { return ' L' + P(p); }).join('') : ' L' + P(out[0]) + smooth(out, false, 0.8).replace(/^M[^C]*/, '')) + ' Z';
    return d;
  }
  function finRays(rig, s0, s1, side, hs, sweep, k) {
    var d = '', n = hs.length;
    for (var i = 1; i < n - 1; i += (k || 1)) {
      var s = lerp(s0, s1, i / (n - 1)), T = rig.T(s), B = [T[1], -T[0]], nr = side < 0 ? B : mul(B, -1), e = rig.at(s, side * 0.95);
      var tip = add(add(e, mul(nr, hs[i] * 0.86)), mul(T, -hs[i] * 0.86 * (sweep || 0.35)));
      d += 'M' + P(e) + ' L' + P(tip) + ' ';
    }
    return d;
  }
  /* Forked tail at the peduncle (s = 0). */
  /* opt.rot turns the whole fin (degrees); opt.cross swings the two lobes past each other
     like crossed legs (degrees), drawing the far lobe first. */
  function tailPath(rig, L, spread, notch, opt) {
    opt = opt || {};
    var p0 = rig.p(0), T = rig.T(0), a = rot(mul(T, -1), opt.rot || 0), B = [-a[1], a[0]];
    L = L || 105; spread = spread || 72; notch = notch || 0.56;
    function TLr(x, y, r) { var v = rot([x, y], r || 0); return [p0[0] + a[0] * v[0] + B[0] * v[1], p0[1] + a[1] * v[0] + B[1] * v[1]]; }
    function TL(x, y) { return TLr(x, y, 0); }
    var rays = '';
    if (opt.cross) {
      var lobes = [], cr = opt.cross;
      [1, -1].forEach(function (sg) {
        var r = -sg * cr, F = function (x, y) { return TLr(x, y * sg, r * sg); };
        lobes.push('M' + P(F(-14, 0)) + ' L' + P(F(-14, 24)) + ' C' + P(F(L * 0.3, 30)) + ' ' + P(F(L * 0.72, spread * 0.7)) + ' ' + P(F(L * 1.02, spread)) +
          ' Q' + P(F(L * 0.7, spread * 0.3)) + ' ' + P(F(L * 0.5, 0)) + ' Z');
        rays += 'M' + P(F(8, 8)) + ' L' + P(F(L * 0.8, spread * 0.72)) + ' M' + P(F(10, 16)) + ' L' + P(F(L * 0.62, spread * 0.36)) + ' ';
      });
      return { lobes: lobes, rays: rays, tips: [TL(L, spread), TL(L, -spread)] };
    }
    var d = 'M' + P(TL(-14, 24)) + ' C' + P(TL(L * 0.3, 30)) + ' ' + P(TL(L * 0.72, spread * 0.7)) + ' ' + P(TL(L * 1.02, spread)) +
      ' Q' + P(TL(L * 0.78, spread * 0.4)) + ' ' + P(TL(L * notch, 0)) +
      ' Q' + P(TL(L * 0.78, -spread * 0.4)) + ' ' + P(TL(L * 1.02, -spread)) +
      ' C' + P(TL(L * 0.72, -spread * 0.7)) + ' ' + P(TL(L * 0.3, -30)) + ' ' + P(TL(-14, -24)) + ' Z';
    rays = 'M' + P(TL(8, 8)) + ' L' + P(TL(L * 0.8, spread * 0.72)) + ' M' + P(TL(8, -8)) + ' L' + P(TL(L * 0.8, -spread * 0.72)) +
      ' M' + P(TL(10, 16)) + ' L' + P(TL(L * 0.62, spread * 0.36)) + ' M' + P(TL(10, -16)) + ' L' + P(TL(L * 0.62, -spread * 0.36));
    return { d: d, rays: rays, tips: [TL(L, spread), TL(L, -spread)] };
  }
  function bodyOutline(rig, capLen) {
    var back = edge(rig, -1, 0, 1, 40), belly = edge(rig, 1, 1, 0, 40), T = rig.T(1), nose = add(rig.p(1), mul(T, capLen || 7));
    var pts = back.concat([nose], belly);
    return { open: smooth(pts, false), closed: smooth(pts, false) + ' Z' };
  }

  /* ---------- fin hands: three rounded lobes ---------- */
  function mitten(kind, fill, sw, sz) {
    sz = sz || 1; var sh = [], rays = '';
    function E(cx, cy, rx, ry, r) { return '<ellipse cx="' + N(cx * sz) + '" cy="' + N(cy * sz) + '" rx="' + N(rx * sz) + '" ry="' + N(ry * sz) + '"' + (r ? ' transform="rotate(' + r + ' ' + N(cx * sz) + ' ' + N(cy * sz) + ')"' : '') + '/>'; }
    if (kind === 'point') {
      sh = [E(12, 0, 15, 13), E(33, -4, 17, 7.5, -4), E(23, 9, 9, 7)];
      rays = 'M' + P(12 * sz, -3 * sz) + ' L' + P(26 * sz, -4 * sz);
    } else if (kind === 'thumb') {
      sh = [E(14, 2, 16, 14), E(15, -20, 7.5, 13, 8), E(27, 3, 8, 11)];
      rays = 'M' + P(20 * sz, 6 * sz) + ' L' + P(30 * sz, 6 * sz);
    } else if (kind === 'grip') {
      sh = [E(13, 0, 15, 15), E(25, -9, 8, 7), E(28, 2, 8, 7), E(25, 12, 8, 7)];
    } else if (kind === 'jazz') {
      sh = [E(13, 0, 15, 14), E(31, -17, 9, 8, -35), E(37, 0, 10, 8), E(31, 17, 9, 8, 35)];
      rays = 'M' + P(14 * sz, -4 * sz) + ' L' + P(28 * sz, -13 * sz) + ' M' + P(16 * sz, 0) + ' L' + P(32 * sz, 0) + ' M' + P(14 * sz, 4 * sz) + ' L' + P(28 * sz, 13 * sz);
    } else {
      sh = [E(14, 0, 17, 14), E(31, -11, 9, 8), E(35, 0, 9.5, 8.5), E(31, 11, 9, 8)];
      rays = 'M' + P(14 * sz, -4 * sz) + ' L' + P(26 * sz, -9 * sz) + ' M' + P(15 * sz, 0) + ' L' + P(29 * sz, 0) + ' M' + P(14 * sz, 4 * sz) + ' L' + P(26 * sz, 9 * sz);
    }
    return union(sh, fill, sw * 0.5 + 0.5) + (rays ? '<path d="' + rays + '" fill="none" stroke="' + INK + '" stroke-width="' + N(3.2 * sz) + '"' + RJ + '/>' : '');
  }
  /* Catmull-Rom samples ({p, d}: point and tangent) through a list of points. */
  function crSample(pts, m) {
    var out = [];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
      var Q = [p1, add(p1, mul(sub(p2, p0), 1 / 6)), sub(p2, mul(sub(p3, p1), 1 / 6)), p2];
      for (var j = i ? 1 : 0; j <= m; j++) out.push({ p: cub(Q, j / m), d: cubD(Q, j / m) });
    }
    return out;
  }
  /* A tapered fin-arm from shoulder to wrist, then the mitten. Returns {svg, hand, dir}.
     el (optional) routes the arm: one point = an elbow the centre line passes through at its
     middle; a list of points = the centre line runs smoothly through each in turn (the
     front-brim hat tip travels round the jaw and up in front of the snout). */
  function finArm(sh, wr, hand, bend, fill, sz, wristRot, el) {
    sz = sz || 1;
    var dv = sub(wr, sh), l = len(dv) || 1, pr = [-dv[1] / l, dv[0] / l], via = el && Array.isArray(el[0]);
    var c = el && !via ? sub(mul(el, 2), mul(add(sh, wr), 0.5)) : add(mul(add(sh, wr), 0.5), mul(pr, bend || 0));
    // a broad pectoral fin at the root, tapering fast to the wrist (Luyen's reference, Sep 26)
    var i, w0 = 24 * sz, w1 = 10 * sz, smp = [];
    if (via) smp = crSample([sh].concat(el, [wr]), 8);
    else for (i = 0; i <= (el ? 18 : 10); i++) {
      var t0 = i / (el ? 18 : 10), u0 = 1 - t0;
      smp.push({ p: [u0 * u0 * sh[0] + 2 * u0 * t0 * c[0] + t0 * t0 * wr[0], u0 * u0 * sh[1] + 2 * u0 * t0 * c[1] + t0 * t0 * wr[1]],
        d: [2 * u0 * (c[0] - sh[0]) + 2 * t0 * (wr[0] - c[0]), 2 * u0 * (c[1] - sh[1]) + 2 * t0 * (wr[1] - c[1])] });
    }
    var n = smp.length - 1, L1 = [], R1 = [], NN = [], W = [];
    for (i = 0; i <= n; i++) {
      var dd = smp[i].d, dl = len(dd) || 1, nn = [-dd[1] / dl, dd[0] / dl], w = w1 + (w0 - w1) * Math.pow(1 - i / n, 2);
      L1.push(add(smp[i].p, mul(nn, w))); R1.push(add(smp[i].p, mul(nn, -w))); NN.push(nn); W.push(w);
    }
    var d = smooth(L1, false) + ' L' + P(R1[n]) + smooth(R1.slice().reverse(), false).replace(/^M[^C]*/, '') + ' Z';
    var end = via ? smp[n].d : sub(wr, c), dir = ang(end) + (wristRot || 0);
    // the root grows out of the body: no ink across it, only along the two edges, and fin rays fan
    // from the base a third of the way down
    var m = Math.max(2, Math.round(n * 0.38)), rays = '';
    [-0.5, 0, 0.5].forEach(function (k) { rays += 'M' + P(add(smp[0].p, mul(NN[0], W[0] * k))) + ' L' + P(add(smp[m].p, mul(NN[m], W[m] * k * 0.8))) + ' '; });
    var svg = path(d, fill, 0) + path(rays, 'none', 3.4 * sz) + path(smooth(L1, false) + ' ' + smooth(R1, false), 'none', 6.5 * sz) +
      g(mitten(hand, fill, 6.5 * sz, sz), 'translate(' + P(wr) + ') rotate(' + N(dir) + ')');
    var palm = add(wr, rot([14 * sz, 0], dir));
    return { svg: svg, palm: palm, dir: dir };
  }

  /* ---------- eyes ---------- */
  /* A big round cartoon eye with a lid: lid 0 open .. 1 shut, lower 0..1 cheek lid,
     look [-1..1, -1..1] in the head's frame, a = head angle in degrees. */
  var BROWS = { up: [-0.75, -1.38, 0, -1.62, 0.75, -1.4], high: [-0.75, -1.55, 0, -1.85, 0.75, -1.6], sad: [-0.8, -1.25, 0, -1.4, 0.7, -1.62],
    squint: [-0.8, -1.15, 0, -1.2, 0.8, -1.2], low: [-0.85, -1.12, 0, -1.22, 0.75, -1.12], worry: [-0.8, -1.3, 0, -1.5, 0.7, -1.7],
    cross: [-0.8, -1.5, 0, -1.3, 0.8, -1.1] };
  var BROWS_S = {
    level: [-0.72, -1.2, 0.1, -1.3, 0.95, -1.24],
    weary: [-0.75, -1.02, 0.05, -1.24, 0.95, -1.2],
    sigh: [-0.72, -1.1, 0.1, -1.2, 0.95, -1.44],
    sad: [-0.75, -1.06, 0.15, -1.2, 0.95, -1.54],
    up: [-0.72, -1.3, 0.1, -1.66, 0.95, -1.42],
    arch: [-0.72, -1.24, 0.1, -1.52, 0.95, -1.3],
    kind: [-0.72, -1.2, 0.1, -1.42, 0.95, -1.28],
    high: [-0.72, -1.46, 0.1, -1.76, 0.95, -1.5],
    wink: [-0.72, -1.02, 0.1, -1.08, 0.95, -1.2],
    squint: [-0.72, -1.26, 0.1, -1.18, 0.95, -1.0],
    oops: [-0.72, -1.1, 0.12, -1.3, 0.95, -1.62],
    puzzle: [-0.72, -1.52, 0.1, -1.66, 0.95, -1.24]
  };
  function bigEye(E, r, a, e, lookV, lidFill, sw) {
    sw = sw || 6;
    var s = '', inner = '';
    var lid = e.blink ? 1 : clamp(e.lid || 0, 0, 1), lower = e.blink ? 0 : clamp(e.lower || 0, 0, 1), rr = r * (e.eyeScale || 1);
    inner += circ(0, 0, rr, C.white, 0);
    if (!e.wink && lid < 0.98) {
      var pr = rr * (e.pupil || 0.42), px = clamp(lookV[0], -1, 1) * (rr - pr) * 0.72, py = clamp(lookV[1], -1, 1) * (rr - pr) * 0.72;
      // guard: the pupil centre never rises above the lid line, so an 'up' look under a heavy
      // lid can't leave a blank white eye (s05, s08)
      py = Math.max(py, -rr + 2 * rr * lid + 0.2 * pr);
      inner += circ(px, py, pr, INK, 0) + circ(px - pr * 0.32, py - pr * 0.36, pr * 0.3, C.white, 0);
    }
    if (e.wink) {
      inner += circ(0, 0, rr, lidFill, 0) + path('M' + P(-rr * 0.72, rr * 0.12) + ' Q' + P(0, -rr * 0.55) + ' ' + P(rr * 0.72, rr * 0.12), 'none', sw);
    } else {
      if (lid > 0.001) {
        if (lid >= 0.98) inner += circ(0, 0, rr, lidFill, 0) + path('M' + P(-rr * 0.9, rr * 0.05) + ' Q' + P(0, rr * 0.28) + ' ' + P(rr * 0.9, rr * 0.05), 'none', sw);
        else {
          var yc = -rr + 2 * rr * lid, xc = Math.sqrt(Math.max(rr * rr - yc * yc, 0)), big = yc > 0 ? 1 : 0, dip = rr * 0.14;
          inner += path('M' + P(-xc, yc) + ' A' + N(rr) + ' ' + N(rr) + ' 0 ' + big + ' 1 ' + P(xc, yc) + ' Q' + P(0, yc + dip) + ' ' + P(-xc, yc) + ' Z', lidFill, 0) +
            path('M' + P(-xc, yc) + ' Q' + P(0, yc + dip) + ' ' + P(xc, yc), 'none', sw * 0.9);
        }
      }
      if (lower > 0.001) {
        var yl = rr - 2 * rr * lower, xl = Math.sqrt(Math.max(rr * rr - yl * yl, 0)), bl = yl < 0 ? 1 : 0;
        inner += path('M' + P(-xl, yl) + ' A' + N(rr) + ' ' + N(rr) + ' 0 ' + bl + ' 0 ' + P(xl, yl) + ' Q' + P(0, yl - rr * 0.2) + ' ' + P(-xl, yl) + ' Z', e.cheekFill || C.silver, 0) +
          path('M' + P(-xl, yl) + ' Q' + P(0, yl - rr * 0.2) + ' ' + P(xl, yl), 'none', sw * 0.8);
      }
    }
    inner += path(blob(0, 0, rr, rr, 7, 0.02), 'none', sw);
    if (e.brow) {
      /* brow shapes in eye radii: [x0, y0, xMid, yMid, x1, y1]; x+ is the inner end (toward
         the snout). BROWS_S are the Striper's, sized to his forehead band under the brim. */
      var b = (e.browSet || BROWS)[e.brow];
      if (b) inner += path('M' + P(b[0] * r, b[1] * r) + ' Q' + P(b[2] * r, b[3] * r) + ' ' + P(b[4] * r, b[5] * r), 'none', sw * (e.browW || 1.35));
    }
    if (e.lashes) inner += path('M' + P(rr * 0.35, -rr * 0.92) + ' l' + P(rr * 0.22, -rr * 0.34) + ' M' + P(rr * 0.66, -rr * 0.72) + ' l' + P(rr * 0.32, -rr * 0.26) + ' M' + P(rr * 0.86, -rr * 0.42) + ' l' + P(rr * 0.36, -rr * 0.1), 'none', sw * 0.8);
    s += g(inner, 'translate(' + P(E) + ') rotate(' + N(a) + ')');
    return s;
  }
  /* The Striper's 70s eye (spec.eyeStyle 'retro'): one big clean white oval, a little taller
     than wide, with a crisp even black outline and a solid black oval pupil (no highlight) that
     reads from across the room. Lids are flat head colour (lidFill) cut by a heavy lid line;
     lid 0 open .. 1 shut, lidTilt degrees (- raises the inner end, toward the snout), lower
     0..1 pushes the cheek up so the eye becomes a dome (happy, kind, squint). The pupil never
     rides above the upper lid or below the lower one. Same arguments as bigEye; the brows and
     their sizes are unchanged (eye radii of r). */
  function retroEye(E, r, a, e, lookV, lidFill, sw) {
    sw = sw || 6;
    var inner = '', es = e.eyeScale || 1, rx = r * 0.9 * es, ry = r * 1.07 * es;
    var lid = e.blink ? 1 : clamp(e.lid || 0, 0, 1), lower = e.blink ? 0 : clamp(e.lower || 0, 0, 1);
    var outline = ell(0, 0, rx, ry, 'none', sw);
    if (e.wink || lid >= 0.98) {
      // shut: the oval fills with the head colour; the wink is a happy arch, the blink the lid
      // line hanging low
      // the wink drops the oval altogether: one heavy happy arch, like a closed smiling eye
      if (e.wink) inner += path('M' + P(-rx * 0.9, ry * 0.26) + ' Q' + P(0, -ry * 0.62) + ' ' + P(rx * 0.9, ry * 0.26), 'none', sw * 1.35);
      else inner += ell(0, 0, rx, ry, lidFill, 0) + outline + path('M' + P(-rx * 0.94, ry * 0.08) + ' Q' + P(0, ry * 0.34) + ' ' + P(rx * 0.94, ry * 0.08), 'none', sw * 1.3);
    } else {
      var prx = rx * (e.pupil ? e.pupil * 1.1 : 0.46), pry = prx * 1.12;
      var tx = rx - prx - 1, ty = ry - pry - 1, px = clamp(lookV[0], -1, 1) * tx, py = clamp(lookV[1], -1, 1) * ty;
      var nl = Math.sqrt(px * px / (tx * tx) + py * py / (ty * ty)); if (nl > 1) { px /= nl; py /= nl; }
      var m = Math.tan((e.lidTilt || 0) * rad), d = -ry + 2 * ry * lid, dl = ry - 2 * ry * lower, bowU = ry * 0.1, bowL = -ry * (e.lowerBow == null ? 0.34 : e.lowerBow);
      // guard: the pupil centre stays above the cheek's arch and below the lid line (so an 'up'
      // look under a heavy lid can't leave a blank white eye, s05, s08); the lid wins
      if (lower > 0.001) py = Math.min(py, dl + bowL * 0.5 - 0.45 * pry);
      if (lid > 0.001) py = Math.max(py, d + m * px + bowU * 0.5 + 0.2 * pry);
      var lo = lower > 0.001 ? ellipseCap(rx, ry, dl, 0, 1, bowL) : null;
      inner += (lo ? path(lo.rest, C.white, 0) : ell(0, 0, rx, ry, C.white, 0)) + ell(px, py, prx, pry, INK, 0);
      if (lid > 0.001) { var up = ellipseCap(rx, ry, d, m, -1, bowU); if (up) inner += path(up.fill, lidFill, 0) + path(up.edge, 'none', sw * 1.35); }
      if (lo) inner += path(lo.fill, lidFill, 2, '', lidFill) + path(lo.rest, 'none', sw);
      else inner += outline;
    }
    if (e.brow) {
      var b = (e.browSet || BROWS)[e.brow];
      if (b) inner += path('M' + P(b[0] * r, b[1] * r) + ' Q' + P(b[2] * r, b[3] * r) + ' ' + P(b[4] * r, b[5] * r), 'none', sw * (e.browW || 1.35));
    }
    return g(inner, 'translate(' + P(E) + ') rotate(' + N(a) + ')');
  }

  /* ======================================================================
     THE STRIPER
     ====================================================================== */
  /* Half-widths along the spine (s 0 = tail root, 1 = snout): back side and belly side.
     The crown is domed so there is a forehead band between the eye and the hat brim. */
  var SW_B = table([[0, 20], [0.1, 26], [0.3, 56], [0.5, 78], [0.66, 88], [0.78, 91], [0.86, 87], [0.92, 75], [0.96, 56], [1, 22]]);
  var SW_V = table([[0, 18], [0.1, 22], [0.3, 52], [0.5, 70], [0.66, 76], [0.78, 72], [0.88, 60], [0.95, 42], [1, 14]]);
  /* Expressions. brow = ink brow shape in the forehead band; hat = [tilt deg, lift px]:
     positive tilt pulls the brim down over the eye (weary, sad), negative pushes it back
     (hopeful, surprised). */
  var STR_EXPR = {
    neutral: { lid: 0.44, brow: 'level', mouth: 'flat', hat: [0, 0] },
    weary: { lid: 0.64, brow: 'weary', mouth: 'flat', look: [0.3, 0.35], hat: [15, -6] },
    sigh: { lid: 0.74, brow: 'sigh', mouth: 'o', look: [0.1, 0.4], hat: [10, -4] },
    sad: { lid: 0.46, lidTilt: -10, brow: 'sad', mouth: 'frown', look: [0.1, 0.5], hat: [8, -2] },
    hopeful: { lid: 0.04, brow: 'up', mouth: 'smile', look: [0.35, -0.55], hat: [-16, 12] },
    happy: { lid: 0.06, lower: 0.16, brow: 'arch', mouth: 'smile', hat: [-6, 4] },
    kind: { lid: 0.3, lower: 0.24, brow: 'kind', mouth: 'smile', hat: [-2, 0] },
    surprised: { lid: 0, eyeScale: 1.1, pupil: 0.3, brow: 'high', mouth: 'o', look: [0, 0], hat: [-26, 34] },
    wink: { wink: true, brow: 'wink', mouth: 'smirk', hat: [5, 0] },
    grin: { lid: 0.02, eyeScale: 1.05, pupil: 0.36, brow: 'high', mouth: 'grin', look: [0, 0], hat: [-12, 16] },
    squint: { lid: 0.46, lower: 0.3, lowerBow: 0.08, brow: 'squint', mouth: 'flat', look: [0.5, 0.1], hat: [4, 0] },
    talk: { lid: 0.3, brow: 'up', mouth: 'smile', hat: [-4, 2] },
    sheepish: { lid: 0.34, brow: 'oops', mouth: 'flat', look: [0, 0.05], hat: [6, -8] },
    puzzled: { lid: 0.42, lower: 0.2, brow: 'puzzle', mouth: 'frown', look: [0.2, -0.6], hat: [0, 0] }
  };
  /* spine control points (facing right, origin on the ground under the tail). A spine may
     chain several cubics (3n+1 points): 'sit' is tail hanging over the front of the
     suitcase, thigh along the lid, torso up, head forward. */
  var STR_SPINE = {
    stand: [[-16, -104], [-22, -226], [10, -330], [150, -352]],
    tall: [[-12, -104], [-16, -240], [16, -366], [140, -404]],
    slump: [[-20, -100], [-34, -210], [0, -306], [146, -296]],
    lean: [[-60, 260], [-66, 110], [-44, -70], [110, -80]],
    swim: [[-180, -84], [-60, -90], [60, -90], [182, -80]],
    leap: [[-172, -40], [-70, -140], [70, -140], [176, -50]],
    sit: [[134, -150], [104, -152], [72, -158], [40, -164], [18, -168], [2, -178], [-2, -204], [-8, -256], [-2, -342], [134, -370]],
    step0: [[-10, -104], [-30, -226], [4, -334], [146, -350]],
    step1: [[-24, -104], [-2, -224], [20, -328], [156, -356]]
  };
  /* arms: [dx, dy, hand, wristRot, bend] offsets of the wrist from the shoulder (facing right).
     frames: poses with two held drawings take o.frame 0 | 1 (shake, twoStep). */
  var STR_POSE = {
    neutral: { spine: 'stand', near: [44, 88, 'grip', 0, -14], far: [-20, 84, 'open', 0, 10], suit: 'near', expr: 'neutral' },
    talk: { spine: 'stand', near: [96, 6, 'open', -30, -24], far: [-24, 84, 'open', 0, 10], suit: 'far', expr: 'talk' },
    sing: { spine: 'tall', near: [118, 4, 'open', -40, -26], far: [-104, -30, 'open', 30, 20], suit: 'ground', expr: 'happy' },
    point: { spine: 'stand', near: [130, -18, 'point', 0, -10], far: [-24, 84, 'open', 0, 10], suit: 'far', expr: 'talk' },
    pointUp: { spine: 'tall', near: [136, -104, 'point', -10, -22], far: [-24, 84, 'open', 0, 10], suit: 'far', expr: 'hopeful' },
    pointSelf: { spine: 'stand', near: [4, 30, 'point', 180, 30], far: [-24, 84, 'open', 0, 10], suit: 'far', expr: 'talk' },
    shrug: { spine: 'stand', sink: 9, near: [146, -48, 'open', -62, 26], far: [-176, -58, 'open', 62, -26], suit: 'ground', expr: 'sheepish' },
    sad: { spine: 'slump', near: [30, 96, 'open', 30, -8], far: [-24, 92, 'open', 0, 10], suit: 'near', expr: 'sad' },
    sigh: { spine: 'slump', near: [30, 96, 'grip', 30, -8], far: [-24, 92, 'open', 0, 10], suit: 'near', expr: 'sigh' },
    hopeful: { spine: 'tall', near: [60, 12, 'open', -80, -26], far: [48, 0, 'open', -90, -20], suit: 'ground', expr: 'hopeful' },
    surprised: { spine: 'tall', near: [164, -18, 'jazz', -30, -16], far: [-80, -88, 'jazz', 20, 20], suit: 'ground', expr: 'surprised' },
    wink: { spine: 'stand', near: [124, 8, 'point', -26, -22], far: [-24, 84, 'open', 0, 10], suit: 'far', expr: 'wink' },
    shake: { spine: 'stand', near: [44, 88, 'grip', 0, -14], far: [-20, 84, 'open', 0, 10], suit: 'near', expr: 'kind', hatTilt: 15, alt: { hatTilt: -13 } },
    photo: { spine: 'tall', near: [36, 70, 'grip', 0, -10], far: [-20, 74, 'open', 0, 10], suit: 'near', expr: 'grin' },
    /* tipHat: the courtesy tip. The near fin travels forward around the snout (elbow is a
       head-frame point in front of the jaw) and pinches the FRONT brim; the hat lifts clear and
       tilts forward toward whoever he faces, and the head dips in a small nod. tipBack: the
       old drawing, the fin behind the head lifting the back brim so the hat tips back (s02
       5.75, s03 6.0). scratch: fin under the back of the hat, hat shoved forward over the
       brow, head cocked, scratch ticks. */
    tipHat: { spine: 'stand', nod: 7, near: [0, 0, 'grip', -70, 0], far: [-20, 84, 'open', 0, 10], suit: 'far', expr: 'kind', hatHand: [98, 16], lift: 50, hatFwd: 34, hatTilt: 46, liftRot: 0, elbow: [[-5, 78], [50, 12]] },
    tipBack: { spine: 'stand', nod: -4, near: [60, -176, 'grip', -60, 40], far: [-20, 84, 'open', 0, 10], suit: 'far', expr: 'kind', hatHand: [-46, 6], lift: 34, hatTilt: -8 },
    scratch: { spine: 'stand', nod: 9, near: [20, -196, 'open', -100, -44], far: [-20, 84, 'open', 0, 10], suit: 'far', expr: 'puzzled', hatHand: [-50, 22], lift: 30, hatTilt: 30, liftRot: 0, marks: true },
    hatOff: { spine: 'stand', near: [136, 36, 'grip', -60, -24], far: [-20, 84, 'open', 0, 10], suit: 'far', expr: 'kind', hold: 'hat', hat: 'off' },
    heart: { spine: 'stand', near: [2, 26, 'open', 150, 26], far: [-24, 84, 'open', 0, 10], suit: 'far', expr: 'kind' },
    thumbsUp: { spine: 'stand', near: [112, 4, 'thumb', 8, -26], far: [-20, 84, 'open', 0, 10], suit: 'far', expr: 'happy' },
    hold: { spine: 'stand', near: [168, -4, 'grip', -90, -24], far: [-20, 84, 'open', 0, 10], suit: 'far', expr: 'talk' },
    /* crank: three held drawings, frame 0 | 1 | 2 for the handle at 0, 120 and 240 degrees
       (machine crank value frame / 3). palm = where the fist lands in the standard staging
       (see K.crankStage); o.reach overrides it with any parent-space point. */
    crank: { spine: 'stand', near: [96, 30, 'grip', 0, -10], far: [-20, 84, 'open', 0, 10], suit: 'ground', expr: 'squint',
      frames: [{ nod: -5, bow: -3, palm: [190, -294] }, { bow: 2, sink: 5, palm: [135, -198], expr: 'weary' }, { bow: 9, nod: 4, palm: [245, -198] }] },
    twoStep: { spine: 'step', near: [66, 58, 'open', -30, -18], far: [-92, 4, 'open', 40, 20], suit: 'none', expr: 'happy', tail: { rot: -12 },
      alt: { near: [136, -22, 'open', -60, -22], far: [-40, 80, 'open', 20, 12], tail: { rot: 12 } } },
    // jawCap: in the lean the near fin lies across the jaw line, so the talk flaps open only to
    // 'mid' and the lower lip and band-aid show on every drawing (s05, s02)
    lean: { spine: 'lean', near: [103, -43, 'open', 30, -40], far: [159, -28, 'open', -4, -14], suit: 'none', expr: 'neutral', jawCap: 'mid' },
    leanTap: { spine: 'lean', near: 'hook', far: [159, -28, 'open', -4, -14], suit: 'none', expr: 'squint' },
    /* leanTipHat: the forearm arcs out well in front of the snout (clear background between
       arm and lips, so the mouth and scar read) and the mitten pinches the front brim.
       frame 0 the full tip | 1 the in-between, hat half up | 2 the nod (head dips) */
    leanTipHat: { spine: 'lean', nod: 7, near: [0, 0, 'grip', -70, 0], far: [159, -28, 'open', -4, -14], suit: 'none', expr: 'kind', hatHand: [98, -4], lift: 66, hatFwd: 34, hatTilt: 46, liftRot: 0, elbow: [[24, 96], [88, 20]],
      frames: [{}, { lift: 30, hatTilt: 24 }, { nod: 15 }] },
    sit: { spine: 'sit', near: [118, 6, 'thumb', 10, -24], far: [-66, 118, 'open', 60, 14], suit: 'under', expr: 'kind', hideFins: ['dorsal2', 'anal'], tail: { len: 0.84, spread: 0.6, rot: 82, cross: 12 } },
    // swim and leap lift the hat 5 px and tip it back 5 degrees so a sliver of silver shows
    // between the brim and the brow at small sizes (s02 11.0 and 13.0, where weary pulls the
    // brim down); liftRot 0 keeps the lift from adding the held-hat tilt
    swim: { spine: 'swim', near: [-28, 58, 'open', 40, 10], far: [-40, 44, 'open', 40, 10], suit: 'none', expr: 'neutral', hatTilt: -5, lift: 5, liftRot: 0 },
    leap: { spine: 'leap', near: [-40, 50, 'open', 30, 10], far: [-50, 40, 'open', 30, 10], suit: 'none', expr: 'happy', hatTilt: -5, lift: 5, liftRot: 0 }
  };
  K.STRIPER_POSES = Object.keys(STR_POSE);
  K.STRIPER_EXPRS = Object.keys(STR_EXPR);

  function spineFor(name, o, pose) {
    if (name === 'step') name = (o.frame || 0) % 2 ? 'step1' : 'step0';
    var S = STR_SPINE[name].map(function (p) { return p.slice(); }), n = S.length - 1;
    pose = pose || {};
    // bow: the upper body pitches forward (+) or back (-) about the waist, in degrees;
    // nod: the head alone dips (+) or lifts (-); sink: the head end drops this many px
    function turn(i, about, a) { S[i] = add(about, rot(sub(S[i], about), a)); }
    if (pose.bow) { var w = S[n - 2].slice(); turn(n - 1, w, pose.bow); turn(n, w, pose.bow); }
    if (pose.nod) turn(n, S[n - 1].slice(), pose.nod);
    if (pose.sink) { S[n][1] += pose.sink; S[n - 1][1] += pose.sink * 0.7; }
    if (name === 'swim' || name === 'leap') {
      var w = Math.sin((o.phase || 0) * Math.PI * 2) * 14;
      S[1][1] += w; S[2][1] -= w;
    }
    // kind head shake on two held drawings: the head sways back with the snout tipped up
    // (frame 0), then forward with it tipped down (frame 1): the snout travels about 25 px each
    // way and the head turns about 8 degrees each way; the hat counter-tilts (STR_POSE.shake)
    if (o.pose === 'shake') {
      if ((o.frame || 0) % 2) { S[3][0] += 22; S[3][1] += 14; S[2][0] += 6; S[2][1] -= 4; }
      else { S[3][0] -= 22; S[3][1] -= 16; S[2][0] -= 6; S[2][1] += 4; }
    }
    if (o.pose === 'wink') { S[3][1] -= 6; }
    return S;
  }

  /* The bucket hat. origin = centre of the band's bottom edge. */
  function bucketHat(page) {
    var s = '';
    if (page) s += g(rect(-26, -64, 52, 44, 3, C.paper, 4) + path('M-16,-52 h30 M-16,-42 h26 M-16,-32 h30', 'none', 3), 'rotate(-18 0 -30) translate(28 -6)');
    s += path('M-48,-6 C-52,-52 -30,-70 2,-70 C34,-70 52,-52 48,-6 Z', C.mustard, LW);
    s += path('M-49,-6 C-49.6,-14 -49.6,-22 -48.4,-28 L48.4,-28 C49.6,-22 49.6,-14 49,-6 Z', C.brick, 0);
    s += path('M-49,-6 C-49.6,-14 -49.6,-22 -48.4,-28 M48.4,-28 C49.6,-22 49.6,-14 49,-6', 'none', LW);
    s += path('M-48.4,-28 L48.4,-28', 'none', 4);
    if (page) s += g(rect(-12, -50, 34, 34, 3, C.paper, 4) + path('M-6,-42 h22 M-6,-34 h18 M-6,-26 h22', 'none', 2.6), 'rotate(-14 0 -30) translate(18 6)');
    // a canvas bucket-hat brim that slopes down at both ends
    s += path('M-86,20 Q-68,-8 0,-9 Q68,-8 88,20 Q90,28 78,28 Q42,10 0,10 Q-42,10 -76,28 Q-90,28 -86,20 Z', C.mustard, LW);
    s += path('M-74,17 Q0,-3 76,17', 'none', 3, ' stroke-dasharray="7 7"', C.brown);
    s += path('M-22,-60 Q-6,-66 12,-62', 'none', 3.2);
    return s;
  }
  K.bucketHat = function (o) { o = o || {}; return place(o, bucketHat(o.page)); };

  /* Mouth geometry, in the head frame: origin at the snout tip, x forward, y toward the belly.
     'long' is the Striper's: the lip line runs back just under the big eye and ends in a corner
     behind and below it, so every corner hook (smile, smirk, frown) reads clear of the eye.
     'short' is Big Mama's (her eye sits higher). hinge = the mouth corner the jaw opens about;
     open / mid = jaw angles for the flaps (grinOpen / grinMid for the stiff grin); corner = the
     hook drawn from the hinge for each mouth kind; teeth = [x, y] where the grin's tooth
     lines leave the upper lip; scar = the healed hook mark on the lower lip (centre, and
     the slash's two ends). */
  var MOUTH_GEO = {
    short: {
      hinge: [-62, 16], open: 28, mid: 14, grinOpen: 22, grinMid: 16,
      upper: [[-62, 16], [-40, 18], [-16, 15], [2, 10], [10, 8]],
      jawTop: [[-62, 16], [-40, 18], [-16, 15], [2, 11], [13, 11]],
      jawBot: [[17, 18], [11, 28], [-10, 34], [-38, 35], [-60, 29], [-70, 20]],
      tongue: [[-50, 17], [-40, 8], [-24, 5], [-8, 8], [-2, 14], [-26, 17]],
      teeth: [[-46, 16.1], [-30, 16.4], [-14, 16.7], [0, 17]],
      corner: { smile: [[-72, 14], [-76, 3]], smirk: [[-74, 12], [-80, 0]], frown: [[-70, 20], [-72, 31]], grin: [[-74, 12], [-80, -1]], talk: [[-70, 14], [-73, 7]] }
    },
    long: {
      hinge: [-78, 31], open: 22, mid: 11, grinOpen: 16, grinMid: 11,
      upper: [[-78, 31], [-62, 29.5], [-42, 26.5], [-18, 20], [2, 11], [10, 8]],
      jawTop: [[-78, 31], [-62, 29.5], [-42, 26.5], [-18, 20], [2, 12], [13, 11]],
      jawBot: [[17, 18], [12, 31], [-8, 41], [-38, 46], [-66, 43], [-84, 37], [-90, 31]],
      tongue: [[-58, 28], [-46, 18], [-28, 14], [-12, 13], [-4, 16], [-30, 23]],
      teeth: [[-56, 28.2], [-38, 25.6], [-20, 20.5], [-4, 13.5]],
      /* smile curls up and back behind the eye (a longer curl than the grin's), smirk is the
         wink's: the whole back half of the upper lip lifts so the corner itself rides up to
         the level of the lower eye rim, the curl sweeps back past the eye and a short cheek
         crease (crease.smirk) sits under it; frown drops, grin is a forced upturn */
      corner: { smile: [[-90, 28], [-99, 20], [-105, 10]], smirk: [[-90, 30], [-101, 26], [-109, 17]], frown: [[-87, 38], [-90, 52]], grin: [[-88, 28], [-95, 17]], talk: [[-87, 29], [-92, 20]] },
      crease: { smirk: [[-95, 40], [-101, 46], [-99, 53]] },
      /* the back half of the lip line (and the jaw with it) bends with the mood: px the corner
         drops (+) or lifts (-), easing in from x = -24 */
      bend: { frown: 6, smile: -4, smirk: -12, grin: -4, talk: -2 },
      scar: { c: [-36, 36], a: [-47, 40], b: [-25, 31] }
    }
  };
  /* The jaw angle (degrees) for a flap state and mouth kind. */
  function jawAngle(geo, ms, kind) {
    if (kind === 'grin') return ms === 'open' ? geo.grinOpen : geo.grinMid;
    return ms === 'open' ? geo.open : ms === 'mid' ? geo.mid : 0;
  }
  /* Rotate a head-frame point with the jaw (about the mouth corner). */
  function jawPt(geo, open, sz, x, y) {
    var h = [geo.hinge[0] * sz, geo.hinge[1] * sz];
    return add(rot(sub([x * sz, y * sz], h), open), h);
  }
  /* Mouth for a fish head. fr maps head-frame points to the figure. geo = MOUTH_GEO entry;
     scar true draws the healed hook mark on the lower lip, riding with the jaw. */
  function bendGeo(geo, kind) {
    var b = geo.bend && geo.bend[kind];
    if (!b) return geo;
    var xs = -24, hx = geo.hinge[0];
    function B(p) { var t = clamp((xs - p[0]) / (xs - hx), 0, 1); return [p[0], p[1] + b * t * t]; }
    function L(a) { return a.map(B); }
    var o = Object.assign({}, geo, { hinge: B(geo.hinge), upper: L(geo.upper), jawTop: L(geo.jawTop), jawBot: L(geo.jawBot), tongue: L(geo.tongue), teeth: L(geo.teeth), corner: {} });
    for (var k in geo.corner) o.corner[k] = L(geo.corner[k]);
    if (geo.scar) o.scar = { c: B(geo.scar.c), a: B(geo.scar.a), b: B(geo.scar.b) };
    if (geo.crease) { o.crease = {}; for (var c in geo.crease) o.crease[c] = L(geo.crease[c]); }
    return o;
  }
  function fishMouth(fr, a, ms, kind, sz, jawFill, geo, scar) {
    sz = sz || 1; geo = bendGeo(geo || MOUTH_GEO.short, kind);
    var open = jawAngle(geo, ms, kind), s = '';
    function J(x, y) { return jawPt(geo, open, sz, x, y); }
    function Wd(p) { return fr(p[0], p[1]); }
    function S(x, y) { return Wd([x * sz, y * sz]); }
    var upper = geo.upper, jawTop = geo.jawTop, jawBot = geo.jawBot;
    var jawPts = jawTop.map(function (p) { return J(p[0], p[1]); }).concat(jawBot.map(function (p) { return J(p[0], p[1]); }));
    var tongue = '';
    if (open > 0) {
      var mpts = upper.map(function (p) { return S(p[0], p[1]); }).concat(jawTop.slice().reverse().map(function (p) { return Wd(J(p[0], p[1])); }));
      s += path(smooth(mpts, true, 0.5), kind === 'grin' ? C.white : INK, 5 * sz);
      if (kind === 'grin') {
        var tl = '';
        geo.teeth.forEach(function (t) { tl += 'M' + P(S(t[0], t[1])) + ' L' + P(Wd(J(t[0], t[1]))) + ' '; });
        s += path(tl, 'none', 3.4 * sz);
      } else if (ms === 'open') {
        // a pink tongue riding on the jaw, inside the opening, so the open mouth never reads as a black beak
        tongue = path(smooth(geo.tongue.map(function (p) { return Wd(J(p[0], p[1])); }), true, 0.8), C.pink, 3.4 * sz);
      }
    }
    s += tongue;
    s += path(smooth(jawPts.map(Wd), true, 0.7), jawFill, LW * sz * 0.8);
    if (scar && geo.scar) {
      // the healed hook mark: a short straight pink slash across the cream lower lip with two
      // ink cross-stitches, drawn through the jaw so it rides with every flap
      var sa = Wd(J(geo.scar.a[0], geo.scar.a[1])), sb = Wd(J(geo.scar.b[0], geo.scar.b[1]));
      var sd = 'M' + P(sa) + ' L' + P(sb);
      s += '<path d="' + sd + '" fill="none" stroke="' + INK + '" stroke-width="' + N(8 * sz) + '"' + RJ + '/><path d="' + sd + '" fill="none" stroke="' + C.pink + '" stroke-width="' + N(3.8 * sz) + '"' + RJ + '/>';
      var v = sub(sb, sa), vl = len(v) || 1, nv = [-v[1] / vl * 7.5 * sz, v[0] / vl * 7.5 * sz], st = '';
      [0.3, 0.7].forEach(function (t) { var m = add(sa, mul(v, t)); st += 'M' + P(sub(m, nv)) + ' L' + P(add(m, nv)) + ' '; });
      s += path(st, 'none', 3 * sz);
    }
    if (!open) s += path(smooth(upper.map(function (p) { return S(p[0], p[1]); }), false), 'none', 5 * sz);
    var cd = geo.corner[kind];
    if (cd) s += path(smooth([geo.hinge].concat(cd).map(function (p) { return S(p[0], p[1]); }), false), 'none', 5.6 * sz);
    var cr = geo.crease && geo.crease[kind];
    if (cr) s += path(smooth(cr.map(function (p) { return S(p[0], p[1]); }), false), 'none', 4.4 * sz);
    // the round 'o' (sigh, surprised) sits on the lip line a little back from the snout tip,
    // so it reads as a mouth and never as a nostril
    if (kind === 'o' && !open) s += path(smooth([[-29, 22], [-20, 15], [-11, 16], [-12, 25], [-23, 28]].map(function (p) { return S(p[0], p[1]); }), true), INK, 3 * sz);
    return s;
  }

  /* The tackle-box suitcase. origin = top centre of the handle. */
  function suitcase(o) {
    o = o || {};
    var s = '', hd = path('M-30,4 C-30,-26 30,-26 30,4', 'none', 17, '', INK) + path('M-30,4 C-30,-26 30,-26 30,4', 'none', 9, '', C.brown);
    if (o.handle === 'only') return hd;
    if (o.handle !== false) s += hd;
    s += path('M-86,10 L86,10 Q96,10 96,20 L94,118 Q94,128 84,128 L-84,128 Q-94,128 -94,118 L-96,20 Q-96,10 -86,10 Z', C.mustard, PW);
    s += path('M-94,40 L94,40', 'none', 4.5);
    s += rect(-12, 30, 24, 20, 4, C.sand, 4.5);
    s += path('M-96,20 Q-96,10 -86,10 L-72,10 L-72,20 Q-80,20 -84,26 L-84,34 L-96,34 Z M96,20 Q96,10 86,10 L72,10 L72,20 Q80,20 84,26 L84,34 L96,34 Z', C.brown, 4);
    s += path('M-94,104 L-80,104 Q-72,108 -70,128 M94,104 L80,104 Q72,108 70,128', 'none', 4);
    if (o.stickers !== false) {
      s += g(blob(0, 0, 26, 26, 3, 0.03) ? path(blob(0, 0, 26, 26, 3, 0.03), C.sky, 4) + lab('MAINE', 0, 4, 12, { fill: INK }) : '', 'translate(-54 78) rotate(-12)');
      s += g(path(blob(0, 0, 25, 25, 5, 0.03), C.cream, 4) + lab('CAPE', 0, -2, 11) + lab('COD', 0, 11, 11), 'translate(-4 88) rotate(8)');
      s += g(path(blob(0, 0, 40, 19, 9, 0.03), C.orange, 4) + lab('CHESAPEAKE', 0, 4, 10.5, { fill: INK }), 'translate(52 72) rotate(-6)');
    }
    s += path('M-60,60 l10,6 M34,112 l12,-4 M-20,114 l6,-6', 'none', 3);
    return s;
  }
  K.suitcase = function (o) { o = o || {}; return place(o, suitcase(o)); };

  /* Build the Striper (also reused, with other proportions, for the School and Big Mama). */
  /* Pose geometry shared by the drawing and K.striperPoints: the rig, head frame, eye,
     shoulders, wrists and the hat placement, all in the figure's local space (facing right). */
  var CLIPN = 0;
  /* Parent space -> a figure's local space (the inverse of place()). */
  function toLocal(o, p) {
    var s = o.scale == null ? 1 : o.scale, v = [p[0] - (o.x || 0), p[1] - (o.y || 0)];
    if (o.rot) v = rot(v, -o.rot);
    return [v[0] / s * (o.flip ? -1 : 1), v[1] / s];
  }
  /* The wrist that puts an arm's palm on a target point (a few relaxation passes). */
  function wristFor(sh, target, A, sz, el) {
    var u = sub(target, sh), l = len(u) || 1, wr = sub(target, mul(u, 14 * sz / l));
    for (var i = 0; i < 4; i++) { var a = finArm(sh, wr, A[2], A[4], C.silver, sz, A[3], el); wr = sub(wr, sub(a.palm, target)); }
    return wr;
  }
  function fishGeom(o, spec) {
    var poseName = spec.poses[o.pose] ? o.pose : spec.defPose;
    var pose = spec.poses[poseName];
    if (pose.alt && (o.frame || 0) % 2) pose = Object.assign({}, pose, pose.alt);
    if (pose.frames) pose = Object.assign({}, pose, pose.frames[Math.abs(Math.round(o.frame || 0)) % pose.frames.length]);
    var exprName = o.expr && spec.exprs[o.expr] ? o.expr : pose.expr;
    var ex = {}; var base = spec.exprs[exprName]; for (var k in base) ex[k] = base[k];
    if (o.blink) ex.blink = true;
    if (o.lid != null) ex.lid = o.lid;   // per-drawing lid override (0 = wide open, 1 = shut)
    if (spec.browSet) { ex.browSet = spec.browSet; ex.browW = spec.browW; }
    var sc = spec.size;
    var ctrl = spec.spine(pose.spine, o, pose).map(function (p) { return [p[0] * sc, p[1] * sc]; });
    var rig = Rig(ctrl, function (s) { return spec.wb(s) * sc; }, function (s) { return spec.wv(s) * sc; });
    var headA = rig.ang(0.93), noseP = rig.p(1), Tn = rig.T(1), Dn = [-Tn[1], Tn[0]];
    var fr = function (x, y) { return [noseP[0] + Tn[0] * x + Dn[0] * y, noseP[1] + Tn[1] * x + Dn[1] * y]; };
    var G = { pose: pose, poseName: poseName, ex: ex, sc: sc, rig: rig, headA: headA, noseP: noseP, fr: fr };
    G.eyeP = rig.at(spec.eye[0], spec.eye[1]);
    // wrist offsets are measured from the reference shoulder; the near fin itself grows from
    // armRoot (lower on the flank for the Striper, so the fin never crosses the mouth corner)
    G.refN = rig.at(spec.shoulder[0], spec.shoulder[1]); G.shF = add(G.refN, [-8 * sc, -6 * sc]);
    G.shN = spec.armRoot ? rig.at(spec.armRoot[0], spec.armRoot[1]) : G.refN;
    // the mouth: which flap state and kind get drawn, and the jaw angle (the hook-mark scar on
    // the lower lip rides with the jaw, so G.hook follows every flap)
    var ms = mouthState(o.mouth);
    // while talking the wink keeps its smirk and the photo grin keeps its teeth
    G.mouthKind = ms === 'closed' || !ms ? (ex.mouth || 'flat') : (ex.mouth === 'grin' || ex.mouth === 'smirk' ? ex.mouth : 'talk');
    G.mouthMs = ms ? (ms === 'closed' ? false : ms) : (ex.mouth === 'grin' ? 'mid' : false);
    if (pose.jawCap === 'mid' && G.mouthMs === 'open') G.mouthMs = 'mid';
    G.geo = MOUTH_GEO[spec.mouth || 'short'];
    G.jawA = jawAngle(G.geo, G.mouthMs, G.mouthKind);
    G.hook = spec.hook && G.geo.scar ? (function () { var bg = bendGeo(G.geo, G.mouthKind), q = jawPt(bg, G.jawA, sc * spec.mouthSize, bg.scar.c[0], bg.scar.c[1]); return fr(q[0], q[1]); })() : null;
    // the hat: pose lift (a fin holding it up) plus the expression's tilt and lift
    var eh = ex.hat || [0, 0];
    if (spec.hat) {
      G.hatA = headA + spec.hatTilt + eh[0] + (pose.hatTilt || 0) + (o.hatTilt || 0);
      G.hatLift = ((pose.lift || 0) + eh[1] + (spec.hatAt[1] || 0)) * sc;
      G.hatP = add(rig.at(spec.hatAt[0], -0.97), rot([(pose.hatFwd || 0) * sc, -G.hatLift], G.hatA));
    }
    function wrist(A, sh, isNear) {
      if (isNear && pose.hatHand && spec.hat) return add(G.hatP, rot([pose.hatHand[0] * sc, pose.hatHand[1] * sc], G.hatA));
      if (A === 'hook' && G.hook) {
        var u = sub(G.hook, G.shN), l = len(u) || 1;
        return sub(G.hook, mul(u, 50 * sc * spec.handSize / l));
      }
      return add(sh, [A[0] * sc, A[1] * sc]);
    }
    G.wrN = wrist(pose.near, G.refN, true); G.wrF = wrist(pose.far, G.shF, false);
    // an elbow the near arm passes through (head frame, like the hat tip going round the snout)
    G.elN = !pose.elbow ? null : Array.isArray(pose.elbow[0]) ? pose.elbow.map(function (q) { return fr(q[0] * sc, q[1] * sc); }) : fr(pose.elbow[0] * sc, pose.elbow[1] * sc);
    // palm targets: o.reach (parent space) or the pose's palm (local, e.g. the crank knob)
    var palmT = o.reach ? toLocal(o, o.reach) : pose.palm ? [pose.palm[0] * sc, pose.palm[1] * sc] : null;
    if (palmT && pose.near !== 'hook') {
      var nA = pose.near;
      G.wrN = wristFor(G.shN, palmT, [0, 0, nA[2], nA[3], nA[4] * sc], sc * spec.handSize, G.elN);
    }
    return G;
  }
  function fishFigure(o, spec) {
    var G = fishGeom(o, spec), pose = G.pose, ex = G.ex, sc = G.sc, rig = G.rig, headA = G.headA, fr = G.fr;
    var lookV = o.look != null ? lookVec(o.look) : (ex.look || [0.4, 0.05]);
    var under = '', body = '', over = '', front = '';
    var shN = G.shN, shF = G.shF;
    if (o.hold == null && pose.hold) o = Object.assign({}, o, { hold: pose.hold });
    if (o.hat == null && pose.hat != null) o = Object.assign({}, o, { hat: pose.hat });
    var hasSuit = spec.suitcase && o.suitcase !== false && (pose.suit !== 'none' || typeof o.suitcase === 'string');
    var suitMode = hasSuit ? (typeof o.suitcase === 'string' ? o.suitcase : pose.suit) : 'none';
    if (o.hold && suitMode === 'near') suitMode = 'far';
    var nearA = pose.near === 'hook' ? [0, 0, 'point', 0, 0] : pose.near, farA = pose.far;
    var aF = finArm(shF, G.wrF, farA[2], farA[4] * sc, spec.finFill, sc * spec.handSize, farA[3]);
    var aN = finArm(shN, G.wrN, nearA[2], nearA[4] * sc, spec.finFill, sc * spec.handSize, nearA[3], G.elN);
    // held items
    function suitAt(p, onGround, ss, handle) {
      ss = (ss || 0.62) * sc;
      return unflip(g(suitcase({ handle: handle }), 'translate(' + P(p[0], p[1] + (onGround ? 0 : -2 * sc)) + ') scale(' + N(ss * 1000) / 1000 + ')'), o.flip, p[0], 0);
    }
    // 'under': he sits on the lid; the whole case, handle included, goes behind him (the
    // handle tucks behind his tail).
    var SIT_CASE = [40, -134.4, 1.05];
    if (suitMode === 'ground') under += suitAt([-150 * sc, -80 * sc], true);
    if (suitMode === 'under') under += suitAt([SIT_CASE[0] * sc, SIT_CASE[1] * sc], true, SIT_CASE[2]);
    if (suitMode === 'far') under += suitAt(aF.palm, false);
    under += aF.svg;
    var hide = pose.hideFins || [];
    function fin(key, side, sweep, spiny) {
      var f = spec[key]; if (!f || hide.indexOf(key) >= 0) return '';
      var hs = f[2].map(function (h) { return h * sc; });
      return path(finAlong(rig, f[0], f[1], side, hs, sweep, spiny), spec.finFill, 6.5 * sc) + (key === 'pelvic' ? '' : path(finRays(rig, f[0], f[1], side, hs, sweep), 'none', 3.4 * sc));
    }
    under += fin('dorsal1', -1, 0.45, true) + fin('dorsal2', -1, 0.5) + fin('anal', 1, 0.5) + fin('pelvic', 1, 0.9);
    var to = pose.tail || {}, tl = spec.tailLen * (to.len || 1);
    var tail = tailPath(rig, 104 * sc * tl, 70 * sc * tl * (to.spread || 1), 0.56, { rot: to.rot, cross: to.cross });
    if (tail.lobes) tail.lobes.forEach(function (d) { under += path(d, spec.finFill, 7 * sc); });
    else under += path(tail.d, spec.finFill, 7 * sc);
    under += path(tail.rays, 'none', 3.4 * sc);
    // body
    var ol = bodyOutline(rig, 7 * sc);
    body += path(ol.closed, spec.bodyFill, 0);
    // the dark back runs to the nape and thins out over the crown, so the forehead band
    // under the hat stays light and the ink brows read against it
    body += path(bandQ(rig, function () { return -1; }, function (s) { return spec.backEnd && s > spec.backEnd[0] ? lerp(spec.backQ, -1.02, clamp((s - spec.backEnd[0]) / (spec.backEnd[1] - spec.backEnd[0]), 0, 1)) : spec.backQ; }, 0, 1), spec.backFill, 0);
    body += path(band(rig, spec.bellyQ, 1, 0.04, 1), spec.bellyFill, 0);
    if (spec.bellyRound) body += path(band(rig, spec.bellyRound, 1, 0.25, 0.82), spec.bellyFill, 0);
    // stripes: bands a constant distance apart (parallel, not fanning with the body width),
    // clipped to the body outline so they end cleanly where the body narrows
    var n = spec.stripes, st = '', dq = spec.stripeW, flat = spec.stripeFlat || 0, wref = spec.stripeRef || 0.55;
    var WB = function (s) { return lerp(rig.wb(s), rig.wb(wref), flat); }, WV = function (s) { return lerp(rig.wv(s), rig.wv(wref), flat); };
    function sAt(s, q) { var p = rig.p(s), T = rig.T(s), Bv = [T[1], -T[0]], w = q < 0 ? -q * WB(s) : -q * WV(s); return [p[0] + Bv[0] * w, p[1] + Bv[1] * w]; }
    function sBand(q0, q1, s0, s1) {
      var A = [], Bp = [], m = 30;
      for (var ii = 0; ii <= m; ii++) { var ss = lerp(s0, s1, ii / m); A.push(sAt(ss, q0)); Bp.push(sAt(ss, q1)); }
      Bp.reverse();
      return smooth(A, false) + ' L' + P(Bp[0]) + smooth(Bp, false).replace(/^M[^C]*/, '') + ' Z';
    }
    for (var i = 0; i < n; i++) {
      var q = lerp(spec.stripeQ[0], spec.stripeQ[1], n === 1 ? 0 : i / (n - 1));
      var s1 = spec.stripeS[1] - Math.abs(q + 0.1) * 0.03, s0 = spec.stripeS[0] + (i % 2) * 0.02;
      st += (flat ? sBand(q - dq, q + dq, s0, s1) : band(rig, q - dq, q + dq, s0, s1)) + ' ';
    }
    if (flat) {
      // clip to the silver flank (back edge to the top of the cream belly), so the belly stays cream
      var cid = 'tbrfc' + (++CLIPN), flank = bandQ(rig, function () { return -1.05; }, function () { return spec.bellyQ; }, 0, 1);
      var gid = '', gclip = '';
      if (spec.gillHead) {
        // the stripes stop a little behind the gill line: clip away the head region in front of it
        var gh = spec.gillHead, hr = [[gh[0][0] - 9, -900]].concat(gh.map(function (p) { return [p[0] - 9, p[1]]; }), [[gh[gh.length - 1][0] - 9, 130], [700, 130], [700, -900]]);
        gid = 'tbrgc' + (++CLIPN);
        gclip = '<clipPath id="' + gid + '"><path clip-rule="evenodd" d="M-6000,-6000 L6000,-6000 L6000,6000 L-6000,6000 Z M' + hr.map(function (p) { return P(fr(p[0] * sc, p[1] * sc)); }).join(' L') + ' Z"/></clipPath>';
      }
      body += '<clipPath id="' + cid + '"><path d="' + flank + '"/></clipPath>' + gclip + '<g clip-path="url(#' + cid + ')">' + (gid ? '<g clip-path="url(#' + gid + ')">' : '') + path(st, C.stripe, 0) + (gid ? '</g>' : '') + '</g>';
    } else body += path(st, C.stripe, 0);
    var gill = [];
    if (spec.gillHead) gill = spec.gillHead.map(function (p) { return fr(p[0] * sc, p[1] * sc); });
    else for (var j = 0; j <= 8; j++) { var qq = lerp(-0.62, 0.86, j / 8); gill.push(rig.at(spec.gillS + 0.03 * (1 - Math.pow((qq - 0.1) / 0.8, 2)), qq)); }
    body += path(smooth(gill, false), 'none', 5 * sc);
    body += path(ol.open, 'none', LW * sc);
    // head features
    var eyeP = G.eyeP;
    if (spec.cheek) over += ell(fr(-40 * sc, 2 * sc)[0], fr(-40 * sc, 2 * sc)[1], 13 * sc, 8 * sc, C.pink, 0, headA);
    if (spec.preHead) over += spec.preHead(rig, fr, headA, sc, o, ex);
    if (!spec.noJaw) over += fishMouth(fr, headA, G.mouthMs, G.mouthKind, sc * spec.mouthSize, spec.jawFill, G.geo, spec.hook);
    over += spec.eyeStyle === 'retro' ? retroEye(eyeP, spec.eyeR * sc, headA, ex, lookV, spec.lidFill, 6 * sc) : bigEye(eyeP, spec.eyeR * sc, headA, ex, lookV, spec.lidFill, 6 * sc);
    if (spec.extraHead) over += spec.extraHead(rig, fr, headA, sc, o, ex);
    // hat
    var hatOn = spec.hat && o.hat !== false && o.hat !== 'off';
    if (hatOn) over += g(bucketHat(o.hatPage), 'translate(' + P(G.hatP) + ') rotate(' + N(G.hatA + (pose.liftRot != null ? pose.liftRot : pose.lift ? -10 : 0)) + ') scale(' + N(sc * (spec.hatScale || 1) * 1000) / 1000 + ')');
    // near arm and what it holds. Held cards and the pencil stay clear of the eye and the
    // mouth: the card sits up and forward of the fist, the pencil points up and away.
    var holdSVG = '', pm = aN.palm;
    // the pencil is the s10 drawing (len 420) with the mitten closed on the ferrule, so the
    // whole barrel reads THE COUNT clear of the fist
    if (o.hold === 'pencil') holdSVG = g(K.pencil({ len: 420, sharp: o.sharp == null ? 1 : o.sharp, label: true, mirrorText: o.flip, x: 190, ting: o.ting }), 'translate(' + P(pm) + ') rotate(-66) scale(' + N(sc * 0.8 * 1000) / 1000 + ')');
    else if (o.hold === 'card') holdSVG = unflip(g(K.card({ label: o.holdText || 'x 5', w: 150, h: 96, size: 56, font: 'label' }), 'translate(' + P(pm[0] + 58 * sc, pm[1] - 56 * sc) + ') scale(' + N(sc * 1000) / 1000 + ')'), o.flip, pm[0] + 58 * sc, pm[1]);
    else if (o.hold === 'hat') holdSVG = g(bucketHat(false), 'translate(' + P(pm[0], pm[1] + 4 * sc) + ') rotate(-20) scale(' + N(sc * 0.95 * 1000) / 1000 + ')');
    else if (o.hold === 'counter') holdSVG = g(K.tallyCounter({}), 'translate(' + P(pm) + ') scale(' + N(sc * 1000) / 1000 + ')');
    else if (typeof o.hold === 'string' && o.hold.charAt(0) === '<') holdSVG = unflip(g(o.hold, 'translate(' + P(pm) + ') scale(' + N(sc * 1000) / 1000 + ')'), o.flip, pm[0], pm[1]);
    if (suitMode === 'near') front += suitAt(aN.palm, false);
    front += holdSVG;
    front += aN.svg;
    if (pose.marks) {
      // scratch ticks: two short curved strokes beside the scratching mitten
      var sp = aN.palm;
      [[-30, -18], [-44, 4]].forEach(function (m) {
        front += path('M' + P(add(sp, [m[0] * sc, m[1] * sc])) + ' q' + P(-10 * sc, -8 * sc) + ' ' + P(-4 * sc, -20 * sc), 'none', 4 * sc);
      });
    }
    if (spec.onTop) front += spec.onTop(rig, fr, headA, sc, o, ex);
    if (o.q) front += K.qmark({ x: eyeP[0] + 40 * sc, y: eyeP[1] - 140 * sc, size: 90 * sc });
    return place(o, under + body + over + front);
  }

  var STRIPER_SPEC = {
    size: 1, poses: STR_POSE, exprs: STR_EXPR, defPose: 'neutral',
    spine: spineFor, wb: SW_B, wv: SW_V,
    bodyFill: C.silver, backFill: C.seaDeep, bellyFill: C.cream, finFill: C.silver, jawFill: C.cream, lidFill: C.silver, eyeStyle: 'retro',
    backQ: -0.72, backEnd: [0.7, 0.8], bellyQ: 0.5, stripes: 7, stripeQ: [-0.62, 0.4], stripeS: [0.06, 0.76], stripeW: 0.05, stripeFlat: 0.75, stripeRef: 0.55, gillS: 0.715,
    /* the gill line in the head frame, set back so the mouth corner and its hooks sit clear of
       it; the stripes are clipped to stop just behind it */
    gillHead: [[-128, -34], [-119, -12], [-116, 10], [-115, 32], [-117, 52], [-121, 68]],
    eye: [0.84, -0.22], eyeR: 35, shoulder: [0.6, 0.34], handSize: 1.1, mouthSize: 1, mouth: 'long', armRoot: [0.55, 0.62], hook: true, hat: true, hatAt: [0.77, 2], hatTilt: -24, hatScale: 0.86,
    browSet: BROWS_S, browW: 1.55,
    dorsal1: [0.5, 0.67, [34, 56, 60, 52, 40, 22]], dorsal2: [0.25, 0.42, [22, 40, 44, 38, 26]], anal: [0.2, 0.33, [18, 34, 36, 26]],
    tailLen: 1, suitcase: true
  };
  K.striper = function (o) { return fishFigure(o || {}, STRIPER_SPEC); };
  /* Map a point from a figure's local space to the parent space, as place() does. */
  function toParent(o, p) {
    var s = o.scale == null ? 1 : o.scale, x = p[0] * s * (o.flip ? -1 : 1), y = p[1] * s;
    if (o.rot) { var r = rot([x, y], o.rot); x = r[0]; y = r[1]; }
    return [(o.x || 0) + x, (o.y || 0) + y];
  }
  /* Where things are on the Striper for a given option set (in parent coordinates):
     {eye, nose, hat, near, far, belly, hook, seat} so scenes can aim an iris, a prop, a
     stamp or a tap. near and far are the fin palms. */
  K.striperPoints = function (o) {
    o = o || {};
    var G = fishGeom(o, STRIPER_SPEC), W = function (p) { return toParent(o, p); };
    var nA = G.pose.near === 'hook' ? [0, 0, 'point', 0, 0] : G.pose.near;
    var aN = finArm(G.shN, G.wrN, nA[2], nA[4], C.silver, 1.1, nA[3], G.elN), aF = finArm(G.shF, G.wrF, G.pose.far[2], G.pose.far[4], C.silver, 1.1, G.pose.far[3]);
    return { eye: W(G.eyeP), nose: W(G.noseP), hat: W(G.hatP || G.rig.at(0.7, -1)), near: W(aN.palm), far: W(aF.palm), belly: W(G.rig.at(0.5, 1)), hook: W(G.hook), seat: W([40, -124]), shoulder: W(G.shN) };
  };

  /* ======================================================================
     HUMANS: Kit the kid, Dot the Surveyor, the voters
     ====================================================================== */
  function humanHand(kind, fill, sw) {
    fill = fill || C.tan; sw = sw || 6;
    function E(cx, cy, rx, ry, r) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"' + (r ? ' transform="rotate(' + r + ' ' + cx + ' ' + cy + ')"' : '') + '/>'; }
    var sh, det = '';
    if (kind === 'open') { sh = [E(12, 0, 15, 14), E(27, 0, 11, 13), E(9, -15, 6, 10, -35)]; det = 'M22,-5 L34,-6 M22,4 L34,5'; }
    else if (kind === 'point') { sh = [E(10, 0, 14, 13), E(30, -4, 14, 6.5), E(7, -13, 5.5, 8, -30)]; det = 'M16,4 L24,5'; }
    else if (kind === 'thumb') { sh = [E(12, 2, 15, 14), E(12, -18, 6.5, 12, 6)]; det = 'M20,-2 L27,-2 M20,6 L27,6'; }
    else { sh = [E(11, 0, 15, 15), E(6, -13, 6, 8, -30)]; det = 'M18,-6 L25,-6 M18,2 L26,2'; }
    return union(sh, fill, sw * 0.5 + 0.5) + path(det, 'none', Math.min(3, sw * 0.5));
  }
  /* via (optional): an elbow point the sleeve's centre line passes through at its middle, so an
     arm can be routed round the face; handDir (optional) sets the mitten's absolute angle. */
  function humanArm(sh, wr, bend, hand, handRot, sleeve, sw, w, hsw, via, handDir) {
    var dv = sub(wr, sh), l = len(dv) || 1, pr = [-dv[1] / l, dv[0] / l], c = add(mul(add(sh, wr), 0.5), mul(pr, bend || 0));
    if (via) c = sub(mul(via, 2), mul(add(sh, wr), 0.5));
    var d = 'M' + P(sh) + ' Q' + P(c) + ' ' + P(wr);
    var dir = handDir != null ? handDir : ang(sub(wr, c)) + (handRot || 0);
    return { svg: tube(d, w || 34, sleeve, sw || 6.5) + g(humanHand(hand, null, hsw || 6), 'translate(' + P(wr) + ') rotate(' + N(dir) + ')'), palm: add(wr, rot([13, 0], dir)), dir: dir, wr: wr };
  }
  function dotEyes(ex, e1, e2, lookV, blink, sw, rx, ry) {
    rx = rx || 9; ry = ry || 13; sw = sw || 5;
    var lx = clamp(lookV[0], -1, 1) * 4, ly = clamp(lookV[1], -1, 1) * 4, s = '';
    [e1, e2].forEach(function (e, i) {
      var k = i ? 0.9 : 1;
      if (blink || ex.eyes === 'closed') {
        s += path(blink ? 'M' + P(e[0] - rx * 1.1, e[1]) + ' Q' + P(e[0], e[1] + ry * 0.55) + ' ' + P(e[0] + rx * 1.1, e[1]) : 'M' + P(e[0] - rx * 1.2, e[1] + 3) + ' Q' + P(e[0], e[1] - ry) + ' ' + P(e[0] + rx * 1.2, e[1] + 3), 'none', sw);
        return;
      }
      if (ex.eyes === 'wide') {
        s += ell(e[0], e[1], rx * 1.55 * k, ry * 1.35 * k, C.white, sw) + circ(e[0] + lx * 1.4, e[1] + ly * 1.4, rx * 0.72, INK, 0) + circ(e[0] + lx * 1.4 - 2.5, e[1] + ly * 1.4 - 3, 2.6, C.white, 0);
        return;
      }
      s += ell(e[0] + lx, e[1] + ly, rx * k, ry * k, INK, 0) + circ(e[0] + lx - rx * 0.3, e[1] + ly - ry * 0.4, rx * 0.36, C.white, 0);
      if (ex.eyes === 'flat') s += path('M' + P(e[0] - rx * 1.5, e[1] - ry * 1.3) + ' L' + P(e[0] + rx * 1.5, e[1] - ry * 1.3) + ' L' + P(e[0] + rx * 1.5, e[1] + 1) + ' L' + P(e[0] - rx * 1.5, e[1] + 1) + ' Z', ex.skin || C.tan, 0) + line(e[0] - rx * 1.4, e[1] + 1, e[0] + rx * 1.4, e[1] + 1, sw);
      if (ex.eyes === 'happyDot') s += path('M' + P(e[0] - rx * 1.3, e[1] + ry * 1.25) + ' Q' + P(e[0], e[1] + ry * 0.6) + ' ' + P(e[0] + rx * 1.3, e[1] + ry * 1.25), 'none', sw * 0.8);
    });
    return s;
  }
  /* Human mouths. cx, cy = mouth centre; kind = expression mouth; ms = flap state; lw = line
     weight (Kit passes her thinner KDW; Dot keeps the default). */
  function humanMouth(cx, cy, kind, ms, w, gap, lw) {
    w = w || 1;
    var L5 = lw ? lw + 0.4 : 5, L45 = lw || 4.5;
    var s = '';
    function D(hw, dep, tongue) {
      var o = path('M' + P(cx - hw, cy - 6 * w) + ' Q' + P(cx, cy - 9 * w) + ' ' + P(cx + hw, cy - 7 * w) + ' Q' + P(cx + hw - 2 * w, cy - 6 * w + dep) + ' ' + P(cx, cy - 5 * w + dep) + ' Q' + P(cx - hw + 2 * w, cy - 6 * w + dep) + ' ' + P(cx - hw, cy - 6 * w) + ' Z', INK, L45);
      var th = Math.min(11 * w, dep * 0.42);
      o += path('M' + P(cx - hw + 4 * w, cy - 6 * w) + ' Q' + P(cx, cy - 8 * w) + ' ' + P(cx + hw - 4 * w, cy - 6.5 * w) + ' L' + P(cx + hw - 5 * w, cy - 6 * w + th) + ' Q' + P(cx, cy - 5 * w + th) + ' ' + P(cx - hw + 5 * w, cy - 6 * w + th) + ' Z', C.white, 0);
      if (gap !== false) o += rect(cx - 2.5 * w, cy - 9 * w, 5 * w, th + 3 * w, 1, INK, 0);
      if (tongue) o += ell(cx + 2 * w, cy - 5 * w + dep - 9 * w, hw * 0.45, 7 * w, C.pink, 0);
      return o;
    }
    if (ms === 'open') return D(24 * w, 30 * w, true);
    if (ms === 'mid') return D(18 * w, 18 * w, false);
    if (kind === 'grin') return D(30 * w, 34 * w, true);
    if (kind === 'grinShut') {
      // the wide grin with the jaw shut: a white row of teeth meeting on a line, gap tooth on top
      var gh = 30 * w, gd = 18 * w;
      s = path('M' + P(cx - gh, cy - 6 * w) + ' Q' + P(cx, cy - 9 * w) + ' ' + P(cx + gh, cy - 7 * w) + ' Q' + P(cx + gh - 2 * w, cy - 6 * w + gd) + ' ' + P(cx, cy - 5 * w + gd) + ' Q' + P(cx - gh + 2 * w, cy - 6 * w + gd) + ' ' + P(cx - gh, cy - 6 * w) + ' Z', C.white, L45);
      s += path('M' + P(cx - gh + 6 * w, cy - 1 * w) + ' Q' + P(cx, cy + 3 * w) + ' ' + P(cx + gh - 6 * w, cy - 2 * w), 'none', L45 * 0.72);
      if (gap !== false) s += rect(cx - 2.5 * w, cy - 8 * w, 5 * w, 8 * w, 1, INK, 0);
      return s;
    }
    if (kind === 'openSmile') return D(20 * w, 20 * w, true);
    if (kind === 'wavy') return path('M' + P(cx - 20 * w, cy + 2 * w) + ' q' + P(5 * w, -7 * w) + ' ' + P(10 * w, 0) + ' t' + P(10 * w, 0) + ' t' + P(10 * w, 0) + ' t' + P(10 * w, 0), 'none', L5);
    if (kind === 'o') return ell(cx + 2, cy + 2, 9 * w, 12 * w, INK, 0);
    if (kind === 'flat') return line(cx - 18 * w, cy, cx + 18 * w, cy - 1, L5);
    if (kind === 'side') return path('M' + P(cx - 6 * w, cy - 1) + ' Q' + P(cx + 8 * w, cy + 5 * w) + ' ' + P(cx + 22 * w, cy - 6 * w), 'none', L5);
    if (kind === 'frown') return path('M' + P(cx - 18 * w, cy + 6 * w) + ' Q' + P(cx, cy - 8 * w) + ' ' + P(cx + 18 * w, cy + 5 * w), 'none', L5);
    return path('M' + P(cx - 22 * w, cy - 6 * w) + ' Q' + P(cx, cy + 14 * w) + ' ' + P(cx + 22 * w, cy - 8 * w), 'none', L5);
  }

  /* ---------------- props held by Kit (drawn in world coords of the figure) ---------------- */
  function rodSVG(butt, angDeg, bend, lenR, lineTo) {
    lenR = lenR || 330; bend = bend || 0;
    var tipStraight = add(butt, rot([lenR, 0], angDeg));
    var tip = add(butt, rot([lenR * (1 - bend * 0.22), lenR * bend * 0.62], angDeg));
    var ctrl = add(butt, rot([lenR * 0.62, lenR * bend * 0.08], angDeg));
    var d = 'M' + P(butt) + ' Q' + P(ctrl) + ' ' + P(tip);
    var s = '';
    var lt = lineTo || (bend > 0.2 ? add(tip, [120, 190]) : add(tip, [18, 120]));
    s += path('M' + P(tip) + ' Q' + P(add(mul(add(tip, lt), 0.5), bend > 0.2 ? [0, 0] : [16, 10])) + ' ' + P(lt), 'none', 2.6);
    s += tube(d, 9, C.brown, 4.5);
    var reel = add(butt, rot([62, 16], angDeg));
    s += circ(reel[0], reel[1], 14, C.silver, 4.5) + circ(reel[0], reel[1], 4, INK, 0);
    s += tube('M' + P(butt) + ' L' + P(add(butt, rot([46, 0], angDeg))), 15, C.ink, 0);
    if (bend <= 0.2 && !lineTo) s += bobber(lt[0], lt[1]);
    return { svg: s, tip: tip };
  }
  function bobber(x, y, sz) {
    sz = sz || 1;
    return g(path('M-15,0 A15,15 0 0 1 15,0 Z', C.brick, 0) + path('M-15,0 A15,15 0 0 0 15,0 Z', C.white, 0) + circ(0, 0, 15, 'none', 4.5) + line(0, -15, 0, -24, 4), 'translate(' + P(x, y) + ') scale(' + sz + ')');
  }
  K.bobber = function (o) { o = o || {}; return place(o, bobber(0, 0)); };
  K.rod = function (o) { o = o || {}; return place(o, rodSVG([0, 0], o.angle == null ? -60 : o.angle, o.bend || 0, o.len || 330).svg); };
  function cameraSVG(flash) {
    var s = '';
    if (flash) s += K.starburst(-26, -74, 60, 26, 10, C.white, 0.2);
    s += rect(-58, -38, 116, 78, 12, C.cream, PW) + rect(-58, -38, 116, 18, 8, C.brown, 0) + path('M-58,-20 L58,-20', 'none', 4.5) + rect(-58, -38, 116, 78, 12, 'none', PW);
    s += rect(-44, -64, 36, 28, 4, C.white, 5) + path('M-26,-64 L-26,-36 M-44,-50 L-8,-50', 'none', 3);
    s += circ(10, 8, 25, C.ink, 5) + circ(10, 8, 15, C.sea, 4) + circ(4, 2, 5, C.white, 0);
    s += rect(30, -50, 20, 12, 4, C.brick, 4.5);
    s += rect(-50, 40, 100, 8, 2, C.ink, 0);
    return s;
  }
  K.camera = function (o) { o = o || {}; return place(o, cameraSVG(o.flash)); };
  function forkSVG() {
    return tube('M0,0 L0,-80', 9, C.silver, 4) + path('M-14,-82 Q-14,-98 0,-100 Q14,-98 14,-82 Z', C.silver, 4) + path('M-11,-100 L-11,-128 M0,-100 L0,-132 M11,-100 L11,-128', 'none', 11, '', INK) + path('M-11,-100 L-11,-128 M0,-100 L0,-132 M11,-100 L11,-128', 'none', 4, '', C.silver);
  }
  K.fork = function (o) { o = o || {}; return place(o, forkSVG()); };
  function binocSVG() {
    return union(['<rect x="-46" y="-22" width="40" height="46" rx="12"/>', '<rect x="6" y="-22" width="40" height="46" rx="12"/>', '<rect x="-10" y="-10" width="20" height="18" rx="4"/>'], C.olive, 5) +
      circ(-26, 22, 14, C.sea, 4.5) + circ(26, 22, 14, C.sea, 4.5) + circ(-30, 18, 4, C.white, 0) + circ(22, 18, 4, C.white, 0);
  }
  K.binoculars = function (o) { o = o || {}; return place(o, binocSVG()); };

  /* ---------------- Kit ----------------
     Built as a 12-year-old in the 70s Saturday-morning educational-cartoon style: a big round
     face sitting straight on the shoulders (face and cap together about 1:2.5 of her height),
     tall white oval eyes set close together, a nub nose, freckles, clean even outlines (KLW)
     thinner than the Striper's, a stubby rounded slicker, corduroy legs and chunky boots.
     Everything is laid out in "standing coordinates" (facing right, origin on the ground
     between the boots); crouch, kneel and the fork stab move the upper body as one group
     (drop, then pitch about the hip). */
  var KID_H = { head: [8, -398], R: 75, neck: [8, -334], hip: [4, -150] };
  var KLW = 7;     // Kit's silhouette line (the Striper keeps LW)
  var KTW = 5.5;   // Kit's sleeves and trouser legs
  var KDW = 4.2;   // Kit's face details: eyes, brows, nose, mouth
  /* Eyes (head frame): [cx, cy, rx, ry] for the near and the far eye. Tall white ovals set
     close together, the far one a touch narrower (three-quarter view). Keep the centres: s09
     paints its own slow deadpan lid over them. */
  var KID_EYES = [[4, 10, 13.2, 20.5], [36, 8, 12.2, 20]];
  /* eyes: 'dot' (open ovals, pupils aim with look) | 'wide' (bigger ovals, smaller pupils) |
     'happyDot' (cheeks push the lower lids up) | 'closed' (happy arcs) | 'flat' (heavy lids at
     half mast). lid 0..1 lowers the upper lids from the top; lidTilt (degrees) raises (-) or
     drops (+) the inner end of each lid. */
  var KID_EXPR = {
    neutral: { eyes: 'dot', mouth: 'smile', brow: 'soft' },
    talk: { eyes: 'dot', mouth: 'openSmile', brow: 'up' },
    grin: { eyes: 'happyDot', mouth: 'grin', brow: 'up' },
    wide: { eyes: 'wide', mouth: 'o', brow: 'high', look: [0.2, 0] },
    tilt: { eyes: 'dot', mouth: 'side', brow: 'quizzical', tilt: 11, look: [0.4, -0.3] },
    deadpan: { eyes: 'flat', mouth: 'flat', brow: 'flat', look: [-0.9, 0.1] },
    worried: { eyes: 'dot', mouth: 'wavy', brow: 'worry', look: [0.6, 0.2], lid: 0.1, lidTilt: -16 },
    happy: { eyes: 'closed', mouth: 'grin', brow: 'up' },
    think: { eyes: 'dot', mouth: 'side', brow: 'quizzical', look: [0.5, -0.9] },
    sad: { eyes: 'dot', mouth: 'frown', brow: 'sad', look: [0.2, 0.7], lid: 0.26, lidTilt: -18 },
    eager: { eyes: 'wide', mouth: 'grin', brow: 'up', look: [0.8, 0.7] }
  };
  /* Simple arched ink brows (KDW) for [near eye, far eye], each [xL, yL, xR, yR, arch] relative
     to the eye centre (y up is negative), sitting just above the tall eyes and under the cap
     cuff. The near brow's inner end is its right end, the far brow's inner end is its left end. */
  var KID_BROWS = {
    soft: [[-11, -27, 11, -29, -3], [-10, -29, 10, -27, -3]],
    up: [[-11, -30, 11, -33, -4], [-10, -33, 10, -30, -4]],
    high: [[-11, -33, 11, -37, -5], [-10, -36, 10, -32, -4.5]],
    quizzical: [[-11, -27, 11, -28, -1.5], [-10, -35, 10, -31, -5]],
    flat: [[-12, -25, 12, -25, 0], [-11, -25, 11, -25, 0]],
    worry: [[-11, -25, 11, -34, 1], [-10, -33, 10, -25, 1]],
    sad: [[-11, -24, 11, -32, 1], [-10, -31, 10, -24, 1]]
  };
  /* Wrist targets in standing coordinates. Arms: [x, y, hand, handRot, bend] (absolute) or
     {head: [dx, dy], hand, rot, bend} relative to the head centre. body: 'stand' | 'crouch' |
     'kneel' | 'belly'. pitch = degrees the upper body leans forward about the hip. legs =
     [[farDx, farLift], [nearDx, nearLift]] for steps. Poses with alt have two held drawings
     (o.frame 0 | 1). */
  /* Her shoulders sit at the corners of the slicker, and a hanging arm hangs outside its A-line, so
     in three-quarter view both arms read: the near one down her near side, the far one peeking out
     past her far side (behind the body). */
  var KID_SHN = [74, -296], KID_SHF = [-62, -296];
  var KID_HANG_N = [80, -208, 'pocket', 0, -4], KID_HANG_F = [-66, -208, 'pocket', 0, 4];
  /* The slicker (Luyen's reference, Sep 26): boxy, with rounded shoulders about as wide as her face,
     nearly straight sides and a patch pocket at each lower corner. Returned as points (standing
     coordinates) so the sleeves can tell where they overlap it. */
  function kidCoatPts(hem, hw) {
    return [[-50, -324], [8, -333], [62, -324], [83, -317], [92, -300], [95, -240], [96 + hw, hem - 30], [93 + hw, hem - 6], [76 + hw, hem],
      [-64 - hw, hem], [-81 - hw, hem - 6], [-84 - hw, hem - 30], [-84, -240], [-80, -300], [-70, -317]];
  }
  function insidePoly(pt, pts) {
    var c = false;
    for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var a = pts[i], b = pts[j];
      if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  }
  var KID_POCKETS = { near: [52, -196, 36, 42], far: [-78, -196, 32, 42] };      // x, top, w, h
  function kidPocket(k) { var q = KID_POCKETS[k]; return rect(q[0], q[1], q[2], q[3], 5, C.avocado, 3.6) + path('M' + P(q[0], q[1] + 10) + ' L' + P(q[0] + q[2], q[1] + 10), 'none', 3); }
  /* A sleeve that grows out of the slicker: filled, then inked only where it shows. Where an edge runs
     inside the coat near the shoulder it isn't inked, so the sleeve has no seam at the shoulder and its
     crease starts at the armpit. */
  function kidSleeve(sh, ctrl, wr, coat) {
    var n = 24, hw = 15 + KTW / 2, L = [], R = [], T = [], d, dl, nn;
    for (var i = 0; i <= n; i++) {
      var t = i / n, u = 1 - t, p = [u * u * sh[0] + 2 * u * t * ctrl[0] + t * t * wr[0], u * u * sh[1] + 2 * u * t * ctrl[1] + t * t * wr[1]];
      d = [2 * u * (ctrl[0] - sh[0]) + 2 * t * (wr[0] - ctrl[0]), 2 * u * (ctrl[1] - sh[1]) + 2 * t * (wr[1] - ctrl[1])]; dl = len(d) || 1; nn = [-d[1] / dl, d[0] / dl];
      L.push(add(p, mul(nn, hw))); R.push(add(p, mul(nn, -hw))); T.push(t);
    }
    var cap = ' A' + N(hw) + ' ' + N(hw) + ' 0 0 0 ' + P(R[n]);
    var s = path(smooth(L, false) + cap + smooth(R.slice().reverse(), false).replace(/^M[^C]*/, ' L' + P(R[n])) + ' Z', C.avocado, 0);
    function ink(E) {
      var run = [], out = '';
      E.forEach(function (q, i) {
        var hide = T[i] < 0.5 && coat && insidePoly(q, coat);
        if (!hide) run.push(q);
        if ((hide || i === n) && run.length) { if (run.length > 1) out += smooth(run, false) + ' '; run = []; }
      });
      return out;
    }
    s += path(ink(L) + ink(R) + 'M' + P(L[n]) + cap, 'none', KTW);
    return s;
  }
  function kidArm(sh, A, coat) {
    var wr = [A[0], A[1]], via = A[5], pocket = A[2] === 'pocket';
    var dv = sub(wr, sh), l = len(dv) || 1, pr = [-dv[1] / l, dv[0] / l];
    var ctrl = via ? sub(mul(via, 2), mul(add(sh, wr), 0.5)) : add(mul(add(sh, wr), 0.5), mul(pr, A[4] || 0));
    // an arm with an elbow (via) is drawn in two parts, upper arm then forearm, meeting in a rounded
    // elbow, so a tight fold (a hand on the cheek, a scratch on the head) never pinches the sleeve
    var sleeve;
    if (via) { sleeve = kidSleeve(sh, mul(add(sh, via), 0.5), via, coat) + kidSleeve(via, mul(add(via, wr), 0.5), wr, null); ctrl = via; }
    else sleeve = kidSleeve(sh, ctrl, wr, coat);
    var dir = pocket ? 90 : A[6] != null ? A[6] : ang(sub(wr, ctrl)) + (A[3] || 0);
    var hd = g(humanHand(pocket ? 'fist' : A[2], null, 5), 'translate(' + P(wr) + ') rotate(' + N(dir) + ')');
    return { svg: sleeve + hd, palm: add(wr, rot([13, 0], dir)), dir: dir, wr: wr, pocket: pocket };
  }
  var KID_POSE = {
    neutral: { near: KID_HANG_N, far: KID_HANG_F, expr: 'neutral' },
    talk: { near: [150, -278, 'open', -70, -26], far: KID_HANG_F, expr: 'talk' },
    point: { near: 'aim', far: KID_HANG_F, expr: 'talk' },
    pointBack: { near: KID_HANG_N, far: [-190, -336, 'point', 0, 10], expr: 'talk' },
    // each hand on its own cheek, elbows out and down, so nothing crosses under her chin
    cheeks: { near: { head: [62, 70], hand: 'open', via: [104, 176], dir: -100 }, far: { head: [-48, 68], hand: 'open', via: [-90, 176], dir: -80 }, farOnTop: true, expr: 'worried' },
    cheer: { near: [132, -470, 'open', 0, -20], far: [-128, -466, 'open', 0, 20], expr: 'grin' },
    wave: { near: [128, -462, 'open', 0, -26], far: KID_HANG_F, expr: 'grin' },
    // the scratch: the elbow swings out past her far cheek (via, outboard of the face and hair)
    // so the sleeve rises clear of the face and the forearm comes down onto the top of the
    // cuff, the mitten on the cuff above the far brow. Eyes, nose and mouth stay clear.
    scratch: { near: { head: [70, -62], hand: 'open', via: [150, 52], dir: 172 }, far: KID_HANG_F, expr: 'think', tilt: 8,
      alt: { near: { head: [58, -76], hand: 'open', via: [146, 44], dir: 186 }, tilt: 3 } },
    think: { near: { head: [36, 92], hand: 'point', rot: -80, via: [92, 176] }, far: KID_HANG_F, expr: 'think' },
    // "Wait.": the near hand up in front of her face, index finger raised to cap-cuff height (s08)
    wait: { near: [142, -384, 'point', -50, -18], far: KID_HANG_F, expr: 'think' },
    shrug: { near: [142, -318, 'open', -80, -30], far: [-132, -312, 'open', 80, 30], expr: 'deadpan' },
    fishOn: { near: [128, -262, 'fist', 0, -18], far: [86, -228, 'fist', 0, 34], farOnTop: true, hold: 'rodBent', expr: 'wide', legs: [[-10, 0], [16, 0]], pitch: -6 },
    rod: { near: [92, -236, 'fist', 0, -14], far: KID_HANG_F, hold: 'rod', expr: 'grin' },
    camera: { near: { head: [70, 30], hand: 'fist', rot: 0, bend: -30 }, far: { head: [30, 44], hand: 'fist', rot: 0, bend: -30 }, farOnTop: true, hold: 'camera', expr: 'neutral' },
    photo: { near: [156, -330, 'fist', -90, -30], far: KID_HANG_F, hold: 'photo', expr: 'tilt' },
    // the fist sits forward of her chin line so the forearm never crosses her mouth (s08 note 6)
    fork: { near: [144, -410, 'fist', -90, -12], far: KID_HANG_F, hold: 'fork', napkin: true, expr: 'grin' },
    // frame 0, the wind-up: both sleeves run behind her head (armsBack), so her whole eager face
    // shows and only the fists and the fork come out past her cheek and cap
    stab: { near: [204, -470, 'fist', -90, 30], far: [184, -462, 'fist', -90, 26], farOnTop: true, armsBack: true, hold: 'forkUp', napkin: true, expr: 'eager', pitch: -8, look: [0.9, 0.7], legs: [[-8, 0], [10, 0]],
      alt: { near: [184, -351, 'fist', 0, 0], far: [141, -388, 'fist', 0, 0], farOnTop: false, armsBack: false, hold: 'forkDown', pitch: 18, expr: 'grin', look: [0.9, 0.9], legs: [[-24, 0], [60, 0]],
        kick: { knee: [-40, -96], ankle: [-104, -124], rot: 112 } } },
    stamp: { near: [138, -270, 'fist', 0, -20], far: [104, -262, 'fist', 0, 0, [18, -228]], farOnTop: true, hold: 'stamp', expr: 'talk' },
    push: { near: [170, -280, 'open', -90, -10], far: [160, -250, 'open', -90, 40], farOnTop: true, expr: 'deadpan', pitch: 8 },
    // mittens grip the two barrels from the outside at eye level, elbows out, so the mouth
    // stays clear for talk flaps (s13 bar 63, s14); the hands ride the head tilt
    binoculars: { near: { head: [64, 30], hand: 'fist', rot: 0, bend: 30 }, far: { head: [-20, 32], hand: 'fist', rot: 0, bend: -30 }, farOnTop: true, handsTilt: true, hold: 'binoculars', expr: 'grin' },
    cradle: { near: [212, -252, 'open', -84, -12], far: [110, -250, 'open', -80, -8], expr: 'grin' },
    holdUp: { near: [140, -350, 'fist', -90, -30], far: KID_HANG_F, expr: 'talk' },
    nod: { near: KID_HANG_N, far: KID_HANG_F, expr: 'neutral', tilt: -3, look: [0.5, -0.1],
      alt: { tilt: 13, look: [0.5, 0.6], expr: 'kind' } },
    twoStep: { near: [118, -250, 'open', -40, -24], far: [-112, -236, 'open', 40, 24], expr: 'grin', legs: [[-22, 0], [34, 0]], pitch: 3,
      alt: { near: [84, -212, 'open', 20, -14], far: [-80, -280, 'open', -20, 20], legs: [[-6, 0], [14, 22]], pitch: -3, tilt: -5 } },
    crouch: { body: 'crouch', near: [118, -132, 'open', 70, -10], far: [84, -134, 'open', 70, -8], farOnTop: false, expr: 'neutral' },
    crouchPhoto: { body: 'crouch', near: [176, -318, 'fist', -90, -30], far: [96, -136, 'open', 70, -8], hold: 'photo', expr: 'tilt' },
    kneel: { body: 'kneel', near: [182, -214, 'open', -80, -10], far: [130, -210, 'open', -80, 36], farOnTop: true, expr: 'grin' },
    belly: { body: 'belly', expr: 'tilt' }
  };
  KID_EXPR.kind = { eyes: 'happyDot', mouth: 'smile', brow: 'soft' };
  // 'tilt' with the smile gone flat: her face falls (s08, during his head shake)
  KID_EXPR.fall = { eyes: 'dot', mouth: 'flat', brow: 'quizzical', tilt: 9, look: [0.6, -0.2], lid: 0.16 };
  K.KID_POSES = Object.keys(KID_POSE);
  K.KID_EXPRS = Object.keys(KID_EXPR);

  function kidBrows(kind, e1, e2) {
    var d = KID_BROWS[kind]; if (!d) return '';
    var s = '';
    [e1, e2].forEach(function (e, i) {
      var b = d[i], a = [e[0] + b[0], e[1] + b[1]], c = [e[0] + b[2], e[1] + b[3]], m = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2 + b[4] * 2];
      s += path('M' + P(a) + ' Q' + P(m) + ' ' + P(c), 'none', KDW + 0.3);
    });
    return s;
  }
  /* The part of an ellipse (centre 0, 0) above (side -1) or below (side 1) the line
     v = d + m u, its cut edge bowed by bow px (a Q control), as a closed path; '' when the line
     misses the ellipse. Returns {fill, edge} (edge = the open lid line). */
  function ellipseCap(rx, ry, d, m, side, bow) {
    var A = 1 / (rx * rx) + m * m / (ry * ry), B = 2 * d * m / (ry * ry), Cq = d * d / (ry * ry) - 1, D = B * B - 4 * A * Cq;
    if (D <= 0) return null;
    var q = Math.sqrt(D), u1 = (-B - q) / (2 * A), u2 = (-B + q) / (2 * A);
    var p1 = [u1, d + m * u1], p2 = [u2, d + m * u2], mid = [(u1 + u2) / 2, d + m * (u1 + u2) / 2 + (bow || 0)];
    var edge = 'M' + P(p1) + ' Q' + P(mid) + ' ' + P(p2);
    // rest = the outline of what is left of the eye on the other side of the cut
    var top = 'M' + P(p1) + ' A' + N(rx) + ' ' + N(ry) + ' 0 ' + (d > 0 ? 1 : 0) + ' 1 ' + P(p2), bot = 'M' + P(p2) + ' A' + N(rx) + ' ' + N(ry) + ' 0 ' + (d < 0 ? 1 : 0) + ' 1 ' + P(p1);
    if (side < 0) return { fill: top + ' Q' + P(mid) + ' ' + P(p1) + ' Z', edge: edge, rest: bot + ' Q' + P(mid) + ' ' + P(p2) + ' Z' };
    return { fill: bot + ' Q' + P(mid) + ' ' + P(p2) + ' Z', edge: edge, rest: top + ' Q' + P(mid) + ' ' + P(p1) + ' Z' };
  }
  /* Kit's eyes in the 70s style: two tall white ovals set close together with a clean black
     outline and solid black oval pupils that aim with look (the pupil may press right up to the
     rim, which is what makes a glance read). Lids are flat skin (tan) with a heavy lid line;
     the pupil never rides above an upper lid or below a lower one. */
  function kidEyes(ex, lookV, blink) {
    var kind = blink ? 'blink' : (ex.eyes || 'dot'), s = '';
    var lx = clamp(lookV[0], -1, 1), ly = clamp(lookV[1], -1, 1);
    // the far eye first, so eyes that touch (wide) overlap with the near eye in front
    [1, 0].forEach(function (i) {
      var E = KID_EYES[i], cx = E[0], cy = E[1], rx = E[2], ry = E[3], inner = '';
      // the blink keeps the eye's oval: the lid (skin) fills it and its heavy line sits low
      if (kind === 'blink') { s += g(ell(0, 0, rx, ry, C.tan, KDW) + path('M' + P(-rx * 0.96, ry * 0.18) + ' Q' + P(0, ry * 0.52) + ' ' + P(rx * 0.96, ry * 0.18), 'none', KDW + 1.2), 'translate(' + P(cx, cy) + ')'); return; }
      if (kind === 'closed') { s += path('M' + P(cx - rx * 1.1, cy + 7) + ' Q' + P(cx, cy - ry * 0.95) + ' ' + P(cx + rx * 1.1, cy + 7), 'none', KDW + 0.6); return; }
      var k = kind === 'wide' ? 1.15 : 1; rx *= k; ry *= k;
      var prx = rx * (kind === 'wide' ? 0.36 : 0.47), pry = prx * 1.14;
      var tx = rx - prx - 0.6, ty = ry - pry - 0.6, px = lx * tx, py = ly * ty;
      var nl = Math.sqrt(px * px / (tx * tx) + py * py / (ty * ty)); if (nl > 1) { px /= nl; py /= nl; }
      // happyDot: the cheeks push the lower lids up in a strong arch, so each eye becomes a
      // dome with the pupil riding high in it (smiling eyes)
      var lid = kind === 'flat' ? 0.53 : (ex.lid || 0), lower = kind === 'happyDot' ? 0.24 : (ex.lower || 0);
      var m = Math.tan((ex.lidTilt || 0) * (i ? -1 : 1) * rad), d = -ry + 2 * ry * lid, dl = ry - 2 * ry * lower;
      var bowU = kind === 'flat' ? 0 : ry * 0.1, bowL = -ry * (kind === 'happyDot' ? 0.62 : 0.3);
      if (lower > 0.001) py = Math.min(py, dl + bowL * 0.5 - pry * 0.55);
      if (lid > 0.001) py = Math.max(py, d + m * px + bowU * 0.5 + pry * 0.3);
      py = clamp(py, -ty, ty);
      var lo = lower > 0.001 ? ellipseCap(rx, ry, dl, 0, 1, bowL) : null;
      inner += (lo ? path(lo.rest, C.white, 0) : ell(0, 0, rx, ry, C.white, 0)) + ell(px, py, prx, pry, INK, 0);
      if (lid > 0.001) { var up = ellipseCap(rx, ry, d, m, -1, bowU); if (up) inner += path(up.fill, C.tan, 0) + path(up.edge, 'none', KDW + 1.4); }
      // a lower lid turns the eye into a dome: its outline stops at the lid's arch
      if (lo) inner += path(lo.fill, C.tan, 1.6, '', C.tan) + path(lo.rest, 'none', KDW);
      else inner += ell(0, 0, rx, ry, 'none', KDW);
      s += g(inner, 'translate(' + P(cx, cy) + ')');
    });
    return s;
  }
  /* Kit's head, drawn around its own centre (face about 150 x 146): the hair flipping out
     behind, the C ear, the big round face, freckles over the nose and cheeks, the 70s eyes and
     arched brows, a round nub nose, a simple line or open mouth, the orange pom-pom watch cap
     and the red-and-white bobber pinned to the front of its cuff (her permanent angler's mark). */
  function kidHead(ex, o, lookV, ms) {
    var s = '';
    // hair behind (a 70s flip curling out at the jaw), the far temple lock, then the ear
    s += path('M-40,-42 C-96,-44 -108,14 -96,48 Q-102,62 -116,62 Q-106,80 -82,72 Q-62,64 -58,40 L-32,-34 Z', C.brown, KLW);
    s += path('M60,-42 C90,-30 98,4 88,34 L72,6 Z', C.brown, KLW);
    s += ell(-72, 16, 11, 15, C.tan, KDW + 0.8) + path('M-76,8 q8,5 1,14', 'none', 3.2);
    s += path(blob(2, 2, 75, 72, 21, 0.015), C.tan, KLW);
    // freckles across the nose and both cheeks (the far cheek's sit well inside the outline)
    [[-24, 36], [-16, 43], [-9, 35], [-30, 44], [45, 41], [52, 47], [55, 38]].forEach(function (f, i) { s += circ(f[0], f[1], i > 3 ? 2.2 : 2.4, C.brown, 0); });
    var e1 = [KID_EYES[0][0], KID_EYES[0][1]], e2 = [KID_EYES[1][0], KID_EYES[1][1]];
    s += kidEyes(ex, lookV, o.blink);
    s += kidBrows(ex.brow, e1, e2);
    // the nub nose: a small round ball below and forward of the eyes, tucked against the far
    // eye's lower rim so the face reads three-quarter toward her facing direction
    s += path(blob(27, 33, 11, 9.5, 5, 0.03), C.tan, KDW);
    // a 'closed' flap always closes the mouth; shut expression mouths (frown, flat...) stay as drawn
    var shut = { smile: 1, frown: 1, flat: 1, side: 1, wavy: 1 };
    var mk = !ms ? (ex.mouth || 'smile') : ms === 'closed' ? (shut[ex.mouth] ? ex.mouth : 'smile') : null, mf = ms && ms !== 'closed' ? ms : false;
    // the grin holds through talk flaps (the Striper's rule): 'open' = the wide open grin with
    // the gap tooth and tongue, 'mid' and 'closed' = the shut wide toothy grin
    if (ms && ex.mouth === 'grin') { mk = ms === 'open' ? 'grin' : 'grinShut'; mf = false; }
    s += humanMouth(23, 50, mk, mf, 0.72, undefined, KDW);
    // cap: dome, mustard stripe, cuff with ribs, pom-pom with yarn ticks (sized for the big head)
    var dome = 'M-70,-46 C-78,-100 -24,-124 12,-123 C52,-122 96,-100 86,-46';
    s += path(dome + ' Z', C.orange, KLW);
    s += path('M-74,-72 Q10,-92 90,-72 L89,-60 Q10,-80 -74,-60 Z', C.mustard, 0);
    s += path(dome, 'none', KLW);
    s += path('M-80,-54 Q6,-70 92,-54 L90,-30 Q6,-48 -78,-30 Z', C.orange, KLW);
    var ribs = '';
    for (var x = -70; x <= 82; x += 10) { var t = (x - 6) / 86, my = -42 - 8.5 * (1 - t * t); ribs += 'M' + P(x, my - 6.5) + ' L' + P(x, my + 6.5) + ' '; }
    s += path(ribs, 'none', 2.6);
    var pom = [circ(10, -132, 14)]; for (var i = 0; i < 7; i++) { var a = i / 7 * Math.PI * 2; pom.push(circ(10 + Math.cos(a) * 12, -132 + Math.sin(a) * 12, 8)); }
    s += union(pom.map(function (c) { return c.replace(/ fill="none"/, ''); }), C.orange, 3.5);
    var ticks = ''; for (var j = 0; j < 9; j++) { var aa = j / 9 * Math.PI * 2 + 0.3, r0 = 15, r1 = 21; ticks += 'M' + P(10 + Math.cos(aa) * r0, -132 + Math.sin(aa) * r0) + ' L' + P(10 + Math.cos(aa) * r1, -132 + Math.sin(aa) * r1) + ' '; }
    s += path(ticks, 'none', 2.4);
    // the bobber, pinned to the front of the cuff above the outer corner of the near eye like a
    // lure on a hat band: red half up, its white stem peg and bottom eyelet showing (no clip)
    var bb = rect(-3, -31, 6, 18, 2, C.white, 3) + circ(0, 18.5, 3.6, 'none', 2.6);
    bb += path('M-15,0 A15,15 0 0 1 15,0 Z', C.brick, 0) + path('M-15,0 A15,15 0 0 0 15,0 Z', C.white, 0) + circ(0, 0, 15, 'none', 4) + path('M-15,0 L15,0', 'none', 2.4);
    s += g(bb, 'translate(-24 -44) rotate(-14) scale(1.04)');
    return s;
  }
  function kidArmSpec(A, dyHead, tilt, headTilt) {
    if (!A || A === 'aim') return A;
    if (Array.isArray(A)) return A;
    var hp = [KID_H.head[0] + A.head[0], KID_H.head[1] + A.head[1] + (dyHead || 0)];
    // hands that grip something on the face (binoculars) ride the head tilt about the neck
    if (tilt) hp = add(KID_H.neck, rot(sub(hp, KID_H.neck), tilt));
    // an elbow (via, head-relative) always rides the head tilt, so it stays outside the face
    var via = A.via ? add(KID_H.neck, rot(sub([KID_H.head[0] + A.via[0], KID_H.head[1] + A.via[1] + (dyHead || 0)], KID_H.neck), headTilt || 0)) : null;
    return [hp[0], hp[1], A.hand, A.rot, A.bend, via, A.dir];
  }
  /* Resolve a pose (with alt frame) into the transforms and wrists everything else uses. */
  function kidGeom(o) {
    var poseName = KID_POSE[o.pose] ? o.pose : 'neutral', pose = KID_POSE[poseName];
    if (pose.alt && (o.frame || 0) % 2) pose = Object.assign({}, pose, pose.alt);
    var body = pose.body || 'stand';
    var dy = body === 'crouch' ? 76 : body === 'kneel' ? 34 : 0;
    var pitch = (pose.pitch || 0) + (body === 'crouch' ? 10 : 0);
    var hip = KID_H.hip;
    // upper-body transform: standing coords -> figure coords
    function U(p) { var q = sub(p, hip), r = rot(q, pitch); return [hip[0] + r[0], hip[1] + r[1] + dy]; }
    var tr = 'translate(0 ' + N(dy) + ') rotate(' + N(pitch) + ' ' + P(hip) + ')';
    return { pose: pose, poseName: poseName, body: body, dy: dy, pitch: pitch, U: U, tr: tr };
  }
  function kidBoot(ax, ay, rotDeg, flipToe) {   // flipToe: the toe points left (the far boot when she stands)
    // a chunky rubber boot with a tall shaft and a round toe cap (the sole sits on y = 62)
    var t = flipToe ? -1 : 1;
    var d = 'M' + P(-21 * t, -12) + ' L' + P(19 * t, -12) + ' L' + P(20 * t, 30) + ' C' + P(38 * t, 28) + ' ' + P(46 * t, 40) + ' ' + P(45 * t, 54) + ' L' + P(45 * t, 57) + ' Q' + P(45 * t, 62) + ' ' + P(40 * t, 62) + ' L' + P(-19 * t, 62) + ' Q' + P(-24 * t, 62) + ' ' + P(-24 * t, 56) + ' Z';
    return g(path(d, C.brick, KLW) + path('M' + P(-23 * t, 50) + ' L' + P(44 * t, 50), 'none', 3.6) + path('M' + P(-20 * t, -2) + ' L' + P(18 * t, -2), 'none', 3.2), 'translate(' + P(ax, ay) + ')' + (rotDeg ? ' rotate(' + N(rotDeg) + ')' : ''));
  }
  function kidLeg(a, b, c) {
    // a pant leg through hip a, knee b (optional) and ankle c, brown corduroy
    var d = b ? 'M' + P(a) + ' L' + P(b) + ' L' + P(c) : 'M' + P(a) + ' L' + P(c);
    var v = sub(c, b || a), l = len(v) || 1, n = [-v[1] / l * 6, v[0] / l * 6], m = mul(add(b || a, c), 0.5);
    return tube(d, 36, C.brown, KTW) + path('M' + P(add(add(b || a, mul(v, 0.18)), n)) + ' L' + P(add(sub(c, mul(v, 0.2)), n)), 'none', 2.4, ' opacity=".55"', C.tan);
  }
  K.kid = function (o) {
    o = o || {};
    var G = kidGeom(o), pose = G.pose, body = G.body;
    var exprName = o.expr && KID_EXPR[o.expr] ? o.expr : pose.expr, ex = KID_EXPR[exprName];
    var ms = mouthState(o.mouth), lookV = o.look != null ? lookVec(o.look) : (pose.look || ex.look || [0.4, 0]);
    var tilt = o.tilt != null ? o.tilt : (pose.tilt != null ? pose.tilt : (ex.tilt || 0));
    var hold = o.hold !== undefined ? o.hold : pose.hold;
    var H = KID_H.head;
    var headSVG = g(g(kidHead(ex, o, lookV, ms), 'translate(' + P(H) + ')'), 'rotate(' + N(tilt) + ' ' + P(KID_H.neck) + ')');
    var s = '';
    if (body === 'belly') return place(o, kidBelly(ex, o, lookV, ms, tilt));
    // ---- legs (not part of the upper-body group)
    var legs = '', legsTop = '';
    if (body === 'stand') {
      var L = pose.legs || [[0, 0], [0, 0]];
      var fx = -36 + L[0][0], nx = 28 + L[1][0], fl = L[0][1], nl = L[1][1];
      // kick: the back leg bent at the knee with its boot lifted behind her (the stab lunge)
      if (pose.kick) legs += kidLeg([-22, -158], pose.kick.knee, pose.kick.ankle) + kidBoot(pose.kick.ankle[0], pose.kick.ankle[1], pose.kick.rot);
      else legs += kidLeg([-30, -158], null, [fx, -62 - fl]) + kidBoot(fx + 2, -64 - fl, 0, !L[0][0] && !L[1][0]);
      legs += kidLeg([22, -158], null, [nx, -62 - nl]) + kidBoot(nx, -64 - nl);
    } else if (body === 'crouch') {
      // squat: boots flat, shins up to the knees, thighs forward from the hips under the slicker;
      // the near knee and shin are drawn over the slicker hem (legsTop)
      legs += kidLeg([-10, -86], [108, -122], [60, -58]) + kidBoot(56, -62);
      legsTop = kidLeg([20, -92], [132, -114], [96, -58]) + kidBoot(94, -62);
    } else if (body === 'kneel') {
      // far knee down with its shin along the ground, near foot planted forward, knee up
      legs += kidLeg([-8, -118], [10, -22], [-96, -40]) + kidBoot(-96, -40, 90);
      legs += kidLeg([8, -118], [86, -110], [80, -60]) + kidBoot(80, -64);
    }
    s += legs;
    // ---- upper body, in standing coordinates, moved as one group
    var up = '';
    var dyH = 0;
    var shN = KID_SHN, shF = KID_SHF;
    var hT = pose.handsTilt ? tilt : 0;
    var hem = body === 'stand' ? -140 : body === 'kneel' ? -160 : -176, hw = body === 'stand' ? 0 : 6, coatPts = kidCoatPts(hem, hw);
    var nearA = kidArmSpec(pose.near, dyH, hT, tilt), farA = kidArmSpec(pose.far, dyH, hT, tilt), aN, aF;
    if (nearA === 'aim') { var aa = o.aim == null ? -8 : o.aim, aw = add(shN, rot([142, 0], aa)); nearA = [aw[0], aw[1], 'point', 0, -12]; }
    aN = kidArm(shN, nearA, coatPts);
    aF = kidArm(shF, farA, pose.armsBack ? null : coatPts);
    var fxBack = '';
    if (hold === 'forkDown') {
      // the lunge: both fists on the handle (drawn over it), tines leading forward and down
      // about 30 degrees off vertical; speed lines alongside and a brick impact star where
      // the tines hit the cloth (impact: false hides both)
      var fd = kidForkDown(aN.palm);
      up += g(forkSVG(), 'translate(' + P(fd.h) + ') rotate(' + N(KID_FORK_DOWN) + ') scale(' + KID_FORK_SC + ')');
      if (o.impact !== false) {
        var tipF = G.U(fd.tip), hF = G.U(fd.h), Df = sub(tipF, hF), dl = len(Df) || 1, side = [-Df[1] / dl, Df[0] / dl];
        fxBack += K.impact({ x: tipF[0] + Df[0] / dl * 6, y: tipF[1] + Df[1] / dl * 6, r: 38, n: 8, fill: C.brick, spin: 0.35 });
        fxBack += K.speedLines({ x: hF[0] - side[0] * 70 + Df[0] * 0.55, y: hF[1] - side[1] * 70 + Df[1] * 0.55, rot: ang(Df), len: 130, n: 3, gap: 26, w: 6 });
      }
    }
    if (pose.armsBack) up += aF.svg;
    // the slicker: boxy with rounded shoulders; the neck and a darker shirt show in the V of the collar
    up += path(smooth(coatPts, true), C.avocado, KLW);
    up += path('M-6,-330 L9,-296 L24,-330 Z', C.olive, 4);
    up += path('M16,-300 L24,' + (hem + 2), 'none', 3.6);
    [[34, -276], [36, -234], [38, -192]].forEach(function (b) { if (b[1] < hem - 18) up += g(path('M-9,0 q-8,-6 -14,0', 'none', 2.8) + rect(-9, -4, 20, 8, 4, C.mustard, 3.2), 'translate(' + b[0] + ' ' + b[1] + ')'); });
    if (body === 'stand') up += kidPocket('near') + kidPocket('far');
    up += path('M-44,-323 L-4,-298 L0,-330 Z', C.avocado, 5) + path('M62,-323 L22,-298 L18,-331 Z', C.avocado, 5);
    // the far arm grows out of her far shoulder, over the slicker (under her head); a hand in a
    // pocket goes into it
    if (!pose.farOnTop && !pose.armsBack) { up += aF.svg; if (aF.pocket && body === 'stand') up += kidPocket('far'); }
    // armsBack (the fork wind-up): the near sleeve runs behind the head, so only the fists and
    // the fork show past her cheek and cap
    if (pose.armsBack) up += aN.svg;
    up += headSVG;
    if (o.napkin != null ? o.napkin : pose.napkin) up += g(path('M-16,-314 L46,-316 L16,-256 Z', C.white, 5) + path('M0,-302 L30,-303 M7,-290 L24,-291', 'none', 3, '', C.skyDeep), tilt ? 'rotate(' + N(tilt * 0.3) + ' ' + P(KID_H.neck) + ')' : '');
    // held things
    var pN = aN.palm, pF = aF.palm, holdSVG = '', holdTop = '';
    if (hold === 'rodBent' || hold === 'rod') {
      var r = rodSVG(hold === 'rodBent' ? pF : add(pN, [-6, 30]), hold === 'rodBent' ? -34 : -80, hold === 'rodBent' ? (o.rodBend == null ? 0.8 : o.rodBend) : (o.rodBend || 0), 360);
      holdSVG += r.svg;
    } else if (hold === 'camera') holdTop += g(cameraSVG(o.flash), 'translate(' + P(H[0] + 58, H[1] + 16) + ') scale(0.72)');
    else if (hold === 'photo') holdTop += unflip(g(K.photo({}), 'translate(' + P(pN[0], pN[1] - 50) + ') rotate(6) scale(0.8)'), o.flip, pN[0], pN[1] - 50);
    else if (hold === 'fork') holdTop += g(forkSVG(), 'translate(' + P(pN[0] + 2, pN[1] + 16) + ') scale(' + KID_FORK_SC + ')');
    else if (hold === 'forkUp') holdTop += g(forkSVG(), 'translate(' + P((pN[0] + pF[0]) / 2 - 22, (pN[1] + pF[1]) / 2 - 34) + ') rotate(150) scale(' + KID_FORK_SC + ')');

    else if (hold === 'stamp') holdSVG += unflip(g(K.stamp({ label: o.stampLabel || 'RECOUNT', color: o.stampColor || C.orange }), 'translate(' + P((pN[0] + pF[0]) / 2, (pN[1] + pF[1]) / 2 + 92) + ') scale(0.8)'), o.flip, (pN[0] + pF[0]) / 2, 0);
    else if (hold === 'binoculars') holdTop += g(binocSVG(), 'rotate(' + N(tilt) + ' ' + P(KID_H.neck) + ') translate(' + P(H[0] + 22, H[1] + 2) + ') scale(0.76)');
    else if (hold === 'striper') {
      // s02 3.0: the Striper held flat across her forearms, belly on her palms, head toward her
      // (under her near arm, over her far arm and body). o.fish passes options to K.striper
      // (default 'swim', weary, looking up at her, hat askew, suitcase in his fin, scale 0.55)
      var fo = Object.assign({ pose: 'swim', expr: 'weary', look: 'upFwd', suitcase: 'near', hatTilt: 18, scale: 0.55 }, o.fish || {});
      var fc = [(pN[0] + pF[0]) / 2 + (fo.dx || 0), Math.min(pN[1], pF[1]) + 10 + (fo.dy || 0)];
      fo.x = fc[0]; fo.y = fc[1];
      holdSVG += o.flip ? unflip(K.striper(Object.assign({}, fo, { flip: false })), true, fc[0], fc[1]) : K.striper(Object.assign({}, fo, { flip: true }));
    }
    else if (typeof hold === 'string' && hold.charAt(0) === '<') holdTop += unflip(g(hold, 'translate(' + P(pN) + ')'), o.flip, pN[0], pN[1]);
    if (hold === 'camera' || hold === 'binoculars') up += holdTop, holdTop = '';
    up += holdSVG;
    // the near arm (and whatever it holds) goes on top of the near knee when crouched
    var top = '';
    if (pose.farOnTop && !pose.armsBack) top += aF.svg;
    top += (pose.armsBack ? '' : aN.svg + (aN.pocket && body === 'stand' ? kidPocket('near') : '')) + holdTop;
    if (o.q) top += K.qmark({ x: H[0] + 52 + tilt * 3, y: H[1] - 168, size: 100 });
    var wrap = function (x) { return G.dy || G.pitch ? g(x, G.tr) : x; };
    s += fxBack + wrap(up) + legsTop + wrap(top);
    return place(o, s);
  };
  /* The fork (the same prop size in every drawing, so it never changes between 44.0 and
     44.75): KID_FORK_SC is its scale, KID_FORK_DOWN its angle in the lunge (in the upper-body
     frame, pitched 18 degrees, so the tines lead 30 degrees off vertical on screen).
     kidForkDown gives the handle end h (the near fist grips 62 fork units up the handle) and
     the tine tip, in standing coordinates. */
  var KID_FORK_SC = 1.55, KID_FORK_DOWN = 132;
  function kidForkDown(pN) {
    var D = rot([0, -1], KID_FORK_DOWN), h = sub(pN, mul(D, 62 * KID_FORK_SC));
    return { h: h, tip: add(h, mul(D, 132 * KID_FORK_SC)) };
  }
  /* Lying on her belly on the planks (Luyen's reference, Sep 26): the slicker along the planks, her chest
     up on her elbows, her chin in both hands (each hand cupping a cheek), her head sitting on her
     shoulders at the collar, and her knees down with both shins up and the boots crossed. Origin: on
     the planks under her chest. */
  var KID_BELLY = { head: [80, -206], nearHand: [150, -130], farHand: [8, -134] };
  function kidBelly(ex, o, lookV, ms, tilt) {
    var s = '', H = KID_BELLY.head;
    // legs: thighs along the planks, shins up and crossed, soles to the sky
    s += kidLeg([-212, -30], [-378, -16], [-292, -196]) + kidBoot(-292, -196, 196);
    s += kidLeg([-200, -18], [-334, -8], [-384, -186]) + kidBoot(-384, -186, 166, true);
    // the slicker, lying along the planks, the chest raised to the collar under her chin
    var body = [[-226, -6], [-234, -58], [-218, -92], [-140, -112], [-40, -134], [40, -150], [104, -142], [134, -104], [142, -40], [126, -4], [60, 2], [-190, 2]];
    s += path(smooth(body, true), C.avocado, KLW);
    s += path('M-70,-126 Q-66,-60 -62,-2', 'none', 3.6) + path('M-130,-72 L-84,-74 L-82,-30 L-128,-28 Z', 'none', 3.4);
    s += g(rect(-9, -4, 20, 8, 4, C.mustard, 3.2), 'translate(-40 -70) rotate(90)');
    // the collar under her chin
    s += path('M52,-150 L80,-120 L92,-152 Z', C.avocado, 4.5) + path('M100,-150 L84,-120 L118,-140 Z', C.avocado, 4.5);
    function arm(sh, el, wr, coat) { return kidSleeve(sh, mul(add(sh, el), 0.5), el, coat) + kidSleeve(el, mul(add(el, wr), 0.5), wr, null); }
    // the far arm: upper arm on the slicker, elbow on the planks, forearm up to her far cheek
    var farUpper = kidSleeve([36, -118], [22, -62], [14, -10], body);
    s += farUpper;
    s += g(g(kidHead(ex, o, lookV, ms), 'translate(' + P(H) + ')'), 'rotate(' + N(tilt || 0) + ' ' + P([H[0], H[1] + 70]) + ')');
    s += kidSleeve([14, -10], [10, -70], KID_BELLY.farHand, null) + g(humanHand('open', null, 5), 'translate(' + P(KID_BELLY.farHand) + ') rotate(-70)');
    // the near arm in front: elbow on the planks, forearm up, the hand cupping her near cheek
    s += arm([104, -112], [156, -10], KID_BELLY.nearHand, body) + g(humanHand('open', null, 5), 'translate(' + P(KID_BELLY.nearHand) + ') rotate(-112)');
    if (o.q) s += K.qmark({ x: 140, y: -400, size: 100 });
    return s;
  }
  /* Points on Kit in the parent space: head centre, eye, mouth, near and far wrists, top of the
     pom-pom, and for the fork stab the tine tips (tines), for the photo poses the photo. */
  K.kidPoints = function (o) {
    o = o || {};
    var G = kidGeom(o), pose = G.pose, W = function (p) { return toParent(o, G.U(p)); };
    if (G.body === 'belly') { var BH = KID_BELLY.head; return { head: toParent(o, BH), eye: toParent(o, [BH[0] + 20, BH[1] + 9]), mouth: toParent(o, [BH[0] + 22, BH[1] + 49]), near: toParent(o, KID_BELLY.nearHand), far: toParent(o, KID_BELLY.farHand), top: toParent(o, [BH[0] + 10, BH[1] - 153]) }; }
    var H = KID_H.head;
    var nA = kidArmSpec(pose.near), fA = kidArmSpec(pose.far);
    var nw = nA === 'aim' ? add(KID_SHN, rot([142, 0], o.aim == null ? -8 : o.aim)) : [nA[0], nA[1]];
    var out = { head: W(H), eye: W([H[0] + 20, H[1] + 9]), mouth: W([H[0] + 22, H[1] + 49]), near: W(nw), far: W([fA[0], fA[1]]), top: W([H[0] + 10, H[1] - 153]) };
    if (pose.hold === 'forkDown') out.tines = W(kidForkDown(humanArm(KID_SHN, [nA[0], nA[1]], nA[4], nA[2], nA[3], C.avocado, 6.5, 30).palm).tip);
    if (pose.hold === 'photo') out.photo = W([nA[0] + 13, nA[1] - 50]);
    return out;
  };

  /* ======================================================================
     THE GROWN-UPS: one shared adult figure on Kit's construction (K.grownup), and the cast
     built from it: Dot the Surveyor, the three exit-poll voters, the householder and the
     ramp angler.
     Everyone gets the same face: Kit's tall white oval eyes at her size with solid pupils, her
     arched ink brows, the round nub nose, her simple mouths and her line weights (KLW
     silhouette, KTW sleeves and legs, KDW face details), on a longer adult face (about 168 x
     180) with a C ear. People differ only by silhouette, skin, hair, clothes and one
     accessory. Everything is laid out in standing coordinates (facing right, origin on the
     ground between the feet), like Kit.
     ====================================================================== */
  /* Head frame (centre 0, 0): Kit's two eyes [cx, cy, rx, ry], near then far, moved up to the
     middle of the longer adult face; the nub nose and the mouth keep her spacing under them. */
  var AD_EYES = [[4, -2, 13.2, 20.5], [36, -4, 12.2, 20]];
  var AD_NOSE = [28, 22], AD_MOUTH = [24, 52];
  /* Expressions (the same eye kinds, mouths and brows as Kit's). */
  var AD_EXPR = {
    neutral: { eyes: 'dot', mouth: 'smile', brow: 'soft' },
    talk: { eyes: 'dot', mouth: 'openSmile', brow: 'up' },
    kind: { eyes: 'happyDot', mouth: 'smile', brow: 'soft' },
    happy: { eyes: 'closed', mouth: 'grin', brow: 'up' },
    wide: { eyes: 'wide', mouth: 'o', brow: 'high' },
    curious: { eyes: 'dot', mouth: 'smile', brow: 'up', look: [0.6, 0.5] },
    think: { eyes: 'dot', mouth: 'side', brow: 'quizzical', look: [0.3, -0.95] },
    worried: { eyes: 'dot', mouth: 'wavy', brow: 'worry', look: [0.6, 0.2], lid: 0.1, lidTilt: -16 },
    plain: { eyes: 'dot', mouth: 'flat', brow: 'flat' }
  };
  K.GROWNUP_EXPRS = Object.keys(AD_EXPR);

  /* Kit's eye drawing with the eye table and the lid colour (the wearer's skin) passed in. */
  function adultEyes(ex, lookV, blink, skin, E) {
    var kind = blink ? 'blink' : (ex.eyes || 'dot'), s = '';
    var lx = clamp(lookV[0], -1, 1), ly = clamp(lookV[1], -1, 1);
    [1, 0].forEach(function (i) {
      var cx = E[i][0], cy = E[i][1], rx = E[i][2], ry = E[i][3], inner = '';
      if (kind === 'blink') { s += g(ell(0, 0, rx, ry, skin, KDW) + path('M' + P(-rx * 0.96, ry * 0.18) + ' Q' + P(0, ry * 0.52) + ' ' + P(rx * 0.96, ry * 0.18), 'none', KDW + 1.2), 'translate(' + P(cx, cy) + ')'); return; }
      if (kind === 'closed') { s += path('M' + P(cx - rx * 1.1, cy + 7) + ' Q' + P(cx, cy - ry * 0.95) + ' ' + P(cx + rx * 1.1, cy + 7), 'none', KDW + 0.6); return; }
      var k = kind === 'wide' ? 1.15 : 1; rx *= k; ry *= k;
      var prx = rx * (kind === 'wide' ? 0.36 : 0.47), pry = prx * 1.14;
      var tx = rx - prx - 0.6, ty = ry - pry - 0.6, px = lx * tx, py = ly * ty;
      var nl = Math.sqrt(px * px / (tx * tx) + py * py / (ty * ty)); if (nl > 1) { px /= nl; py /= nl; }
      var lid = ex.lid || 0, lower = kind === 'happyDot' ? 0.24 : (ex.lower || 0);
      var m = Math.tan((ex.lidTilt || 0) * (i ? -1 : 1) * rad), d = -ry + 2 * ry * lid, dl = ry - 2 * ry * lower;
      var bowU = ry * 0.1, bowL = -ry * (kind === 'happyDot' ? 0.62 : 0.3);
      if (lower > 0.001) py = Math.min(py, dl + bowL * 0.5 - pry * 0.55);
      if (lid > 0.001) py = Math.max(py, d + m * px + bowU * 0.5 + pry * 0.3);
      py = clamp(py, -ty, ty);
      var lo = lower > 0.001 ? ellipseCap(rx, ry, dl, 0, 1, bowL) : null;
      inner += (lo ? path(lo.rest, C.white, 0) : ell(0, 0, rx, ry, C.white, 0)) + ell(px, py, prx, pry, INK, 0);
      if (lid > 0.001) { var up = ellipseCap(rx, ry, d, m, -1, bowU); if (up) inner += path(up.fill, skin, 0) + path(up.edge, 'none', KDW + 1.4); }
      if (lo) inner += path(lo.fill, skin, 1.6, '', skin) + path(lo.rest, 'none', KDW);
      else inner += ell(0, 0, rx, ry, 'none', KDW);
      s += g(inner, 'translate(' + P(cx, cy) + ')');
    });
    return s;
  }

  /* ---------- hair (head frame). back: behind the face; front: over it (after the eyes);
     ear: false hides the C ear (the flip covers it) ---------- */
  var AD_HAIR = {
    none: {},
    // Dot: a gray bun at the back of the crown and the hair swept back over the ear
    bun: {
      back: function (f) {
        return path(blob(-78, -66, 30, 28, 4, 0.05), f, KLW) + path('M-92,-72 q12,-10 26,0', 'none', 3.2) +
          path('M-30,-92 C-84,-96 -110,-50 -104,-4 C-100,26 -90,46 -76,56 L-60,10 Z', f, KLW);
      },
      front: function (f) {
        return path('M-84,-18 C-90,-74 -42,-100 8,-100 C56,-100 88,-80 90,-44 Q40,-66 -4,-64 Q-52,-60 -72,-30 Z', f, KLW) +
          path('M-60,-40 q18,-22 52,-30 M-40,-82 q30,-12 62,-6', 'none', 3);
      }
    },
    // the tall man: a gray fringe round the back and over the ear, bald on top, a tuft at the
    // far temple
    fringe: {
      back: function (f) { return path('M-56,-62 C-100,-62 -114,-16 -106,20 C-100,46 -88,60 -72,62 L-60,0 Z', f, KLW); },
      front: function (f) {
        return path('M-58,-50 C-80,-54 -98,-36 -100,-8 C-102,20 -94,44 -80,58 C-78,42 -72,28 -64,18 C-70,-2 -70,-28 -58,-50 Z', f, KLW) +
          path('M-90,-26 q10,-6 18,2', 'none', 3) +
          path('M76,-46 C92,-40 98,-18 92,2 C86,-8 82,-22 76,-28 Z', f, KLW - 1.5) +
          path('M-34,-86 q26,-12 56,-6', 'none', 3.2);
      }
    },
    // the woman at the booth: a mustard flip (bouffant on top, turned out at the jaw)
    flip: {
      ear: false,
      back: function (f) {
        return path('M-66,-78 C-60,-130 60,-138 90,-88 C108,-58 104,-10 98,26 C96,46 104,58 126,58 C120,78 92,84 78,66 L-78,66 C-92,84 -124,80 -132,58 C-110,58 -102,46 -104,26 C-110,-10 -110,-54 -66,-78 Z', f, KLW);
      },
      front: function (f) {
        return path('M-88,-8 C-96,-70 -54,-112 4,-112 C58,-112 94,-88 94,-44 C70,-60 40,-66 10,-60 C-24,-54 -52,-40 -64,-20 C-70,4 -70,26 -72,44 C-70,60 -92,70 -112,62 C-96,56 -86,40 -88,-8 Z', f, KLW) +
          path('M-54,-72 q34,-26 88,-24 M-74,-40 q10,-24 34,-38 M-84,20 q6,24 -10,38', 'none', 3);
      }
    },
    // the younger man: a round ink hairdo with sideburns
    afro: {
      back: function (f) { return path(blob(-8, -44, 116, 108, 17, 0.03, 12), f, KLW); },
      front: function (f) {
        return path('M-86,-4 C-92,-70 -46,-104 8,-104 C60,-104 92,-82 92,-40 C66,-58 30,-62 0,-58 C-30,-54 -52,-44 -62,-26 L-62,40 Q-66,48 -74,44 Q-84,30 -86,-4 Z', f, KLW) +
          path('M-30,-84 q10,-6 18,0 M20,-90 q10,-6 18,0 M-66,-60 q10,-6 18,0', 'none', 2.6, '', C.gray);
      }
    },
    // the householder: brown bed-head, receding in front, a cowlick at the crown
    tuft: {
      back: function (f) { return path('M-30,-80 C-90,-84 -112,-30 -104,14 C-98,44 -86,58 -72,60 L-60,0 Z', f, KLW); },
      front: function (f) {
        return path('M-86,-10 C-92,-60 -64,-92 -24,-98 L-12,-128 L0,-98 L14,-122 L22,-96 C46,-92 64,-84 74,-70 C50,-74 18,-76 -10,-70 C-40,-62 -58,-44 -62,-20 L-62,30 Q-70,40 -80,30 Q-86,14 -86,-10 Z', f, KLW) +
          path('M-50,-70 q14,-8 30,-6', 'none', 3);
      }
    },
    // the ramp angler: short brown hair under a ball cap
    cap: {
      back: function (f) { return path('M-40,-60 C-88,-64 -106,-24 -100,14 C-96,40 -86,54 -74,56 L-60,0 Z', f, KLW); },
      front: function (f, sp) {
        var cf = sp.capFill || C.sea;
        return path('M-78,-20 C-82,0 -76,24 -66,34 L-58,34 L-58,-20 Z', f, KLW - 1) +
          path('M-86,-34 C-90,-96 -34,-122 12,-120 C60,-118 94,-92 92,-44 Q40,-62 -10,-56 Q-54,-50 -86,-34 Z', cf, KLW) +
          path('M8,-118 Q2,-84 6,-56 M-40,-108 Q-46,-80 -40,-54', 'none', 3) + circ(10, -120, 6, cf, 3.5) +
          path('M60,-58 Q128,-70 166,-46 Q160,-34 128,-34 Q92,-36 64,-42 Z', cf, KLW);
      }
    }
  };

  /* One adult head, drawn around its own centre. sp = the look (skin, hair, face, acc...). */
  function adultHead(sp, ex, o, lookV, ms) {
    var s = '', sk = sp.skin || C.tan, fw = sp.face || [84, 90], hb = AD_HAIR[sp.hair] || AD_HAIR.none, hf = sp.hairFill || C.brown;
    var acc = sp.acc || [], E = AD_EYES, my = sp.mouthY || AD_MOUTH[1];
    if (hb.back) s += hb.back(hf, sp);
    s += path(blob(2, 0, fw[0], fw[1], sp.seed || 23, 0.015), sk, KLW);
    if (hb.front) s += hb.front(hf, sp);
    if (acc.indexOf('earPencil') >= 0) s += g(rect(-6, -46, 12, 78, 3, C.mustard, 4) + path('M-6,-46 L0,-60 L6,-46 Z', C.tan, 4) + rect(-6, 30, 12, 10, 2, C.pink, 4), 'translate(-80 -6) rotate(-22)');
    if (hb.ear !== false) s += ell(-fw[0] + 3, 8, 11, 15, sk, KDW + 0.8) + path('M' + P(-fw[0] - 1, 0) + ' q8,5 1,14', 'none', 3.2);
    s += adultEyes(ex, lookV, o.blink, sk, E);
    var lift = sp.browLift || 0;
    s += kidBrows(ex.brow, [E[0][0], E[0][1] - lift], [E[1][0], E[1][1] - lift]);
    if (acc.indexOf('glasses') >= 0) {
      // orange frames round the tall ovals: the far rim first, the near rim meets it at the bridge
      var rim = function (cx, cy, rx, ry) { return ell(cx, cy, rx, ry, 'none', 10.5) + ell(cx, cy, rx, ry, 'none', 0, 0, ' stroke="' + C.orange + '" stroke-width="6.5"'); };
      s += path('M-18,-8 L-78,0', 'none', 9) + path('M-18,-8 L-78,0', 'none', 5, '', C.orange);
      s += rim(39, -4, 19, 28.5) + rim(2, -2, 21.5, 29.5);
    }
    if (acc.indexOf('mustache') >= 0) {
      // push-broom: a straight bristly block under the nose, clear of the mouth
      s += path('M4,36 Q4,26 16,26 L44,25 Q56,26 56,36 L54,44 L6,45 Z', sp.mustacheFill || hf, KDW + 0.4) +
        path('M14,38 l0,6 M24,38 l0,6 M34,38 l0,6 M44,38 l0,6', 'none', 2.6);
    }
    s += path(blob(AD_NOSE[0], AD_NOSE[1], 11, 9.5, 5, 0.03), sk, KDW);
    // mouths as Kit's (no gap tooth: that is hers); a 'closed' flap closes the mouth
    var shut = { smile: 1, frown: 1, flat: 1, side: 1, wavy: 1 };
    var mk = !ms ? (ex.mouth || 'smile') : ms === 'closed' ? (shut[ex.mouth] ? ex.mouth : 'smile') : null, mf = ms && ms !== 'closed' ? ms : false;
    if (ms && ex.mouth === 'grin') { mk = ms === 'open' ? 'grin' : 'grinShut'; mf = false; }
    s += humanMouth(AD_MOUTH[0], my, mk, mf, 0.76, false, KDW);
    if (acc.indexOf('visor') >= 0) {
      var vf = sp.visorFill || C.mustard;
      s += path('M-88,-50 Q0,-88 92,-68 L92,-50 Q0,-70 -88,-32 Z', vf, KLW) + path('M60,-66 Q132,-74 166,-50 Q128,-40 74,-50 Z', vf, KLW);
    }
    return s;
  }

  /* ---------- the tapered sleeve and its mitten ----------
     sh shoulder, wr wrist, bend (px, bows the sleeve), hand kind ('fist' 'open' 'point'
     'thumb'), handRot, sleeve fill, skin. o: w0 / w1 half-widths at the shoulder and cuff,
     via (an elbow the centre line passes through), handDir (absolute mitten angle), cuff
     (a cuff line), hs (mitten scale). Returns {sleeve, hand, svg, palm, dir, wr}. */
  /* A tapered, round-ended stretch of sleeve from a to b (half-widths wa, wb): {fill, ink}. Where
     skipBody is given, its edges aren't inked inside that outline for the first `skip` of the way. */
  function sleeveBit(a, b, wa, wb, skipBody, skip, flatStart) {
    var v = sub(b, a), l = len(v) || 1, u = [v[0] / l, v[1] / l], nn = [-u[1], u[0]], n = 10, L = [], R = [];
    for (var i = 0; i <= n; i++) { var t = i / n, p = add(a, mul(v, t)), w = lerp(wa, wb, t); L.push(add(p, mul(nn, w))); R.push(add(p, mul(nn, -w))); }
    var d = 'M' + P(L[0]) + ' L' + P(L[n]) + ' A' + N(wb) + ' ' + N(wb) + ' 0 0 1 ' + P(R[n]) + ' L' + P(R[0]) + (flatStart ? '' : ' A' + N(wa) + ' ' + N(wa) + ' 0 0 1 ' + P(L[0])) + ' Z';
    function edge(E) {
      var run = [], out = '';
      E.forEach(function (q, i) {
        var hide = skipBody && i <= n * skip && insidePoly(q, skipBody);
        if (!hide) run.push(q);
        if ((hide || i === n) && run.length) { if (run.length > 1) out += 'M' + run.map(function (q) { return P(q); }).join(' L') + ' '; run = []; }
      });
      return out;
    }
    var ink = edge(L) + edge(R) + 'M' + P(L[n]) + ' A' + N(wb) + ' ' + N(wb) + ' 0 0 1 ' + P(R[n]) + ' ';
    if (!flatStart && !(skipBody && insidePoly(a, skipBody))) ink += 'M' + P(R[0]) + ' A' + N(wa) + ' ' + N(wa) + ' 0 0 1 ' + P(L[0]);
    return { fill: d, ink: ink };
  }
  function adultArm(sh, wr, bend, hand, handRot, sleeve, skin, o) {
    o = o || {};
    if (o.elbow) {
      // upper arm down to the elbow, then the forearm, each outlined (only the very top of the upper arm
      // merges into the shoulder)
      var el = o.elbow, w0e = o.w0 || 19, w1e = o.w1 || 13, wm = (w0e + w1e) / 2;
      // the upper arm starts flat at the top's shoulder corner, its outer edge running on down from the
      // shoulder line, so the shoulder has no notch (Luyen, Sep 26)
      var a0 = sh;
      if (o.corner) a0 = [o.corner[0] + (o.corner[0] < 0 ? 1 : -1) * (w0e - 1), o.corner[1] + 3];
      var up = sleeveBit(a0, el, w0e, wm, o.body, 0.3, !!o.corner), fo = sleeveBit(el, wr, wm, w1e, null, 0);
      var dirE = o.handDir != null ? o.handDir : ang(sub(wr, el)) + (handRot || 0), hsE = o.hs || 1.14;
      var slE = path(up.fill, sleeve, 0) + path(up.ink, 'none', KTW) + path(fo.fill, sleeve, 0) + path(fo.ink, 'none', KTW);
      if (o.cuff === 'rib' || o.cuff) { var caE = ang(sub(wr, el)), cwE = rot([0, w1e + 1], caE), bE = add(wr, rot([-12, 0], caE)); slE += path('M' + P(add(bE, cwE)) + ' L' + P(sub(bE, cwE)), 'none', 3.2); }
      var hdE = g(humanHand(hand, skin, 5), 'translate(' + P(wr) + ') rotate(' + N(dirE) + ') scale(' + hsE + ')');
      return { sleeve: slE, hand: hdE, svg: slE + hdE, palm: add(wr, rot([13 * hsE, 0], dirE)), dir: dirE, wr: wr };
    }
    var w0 = o.w0 || 19, w1 = o.w1 || 13, hs = o.hs || 1.14;
    var dv = sub(wr, sh), l = len(dv) || 1, pr = [-dv[1] / l, dv[0] / l];
    var c = o.via ? sub(mul(o.via, 2), mul(add(sh, wr), 0.5)) : add(mul(add(sh, wr), 0.5), mul(pr, bend || 0));
    var L1 = [], R1 = [], n = 10, t0 = null;
    for (var i = 0; i <= n; i++) {
      var t = i / n, u = 1 - t;
      var p = [u * u * sh[0] + 2 * u * t * c[0] + t * t * wr[0], u * u * sh[1] + 2 * u * t * c[1] + t * t * wr[1]];
      var dd = [2 * u * (c[0] - sh[0]) + 2 * t * (wr[0] - c[0]), 2 * u * (c[1] - sh[1]) + 2 * t * (wr[1] - c[1])], dl = len(dd) || 1, nn = [-dd[1] / dl, dd[0] / dl], w = lerp(w0, w1, t);
      if (!i) t0 = [dd[0] / dl, dd[1] / dl];
      L1.push(add(p, mul(nn, w))); R1.push(add(p, mul(nn, -w)));
    }
    var d = smooth(L1, false) + ' L' + P(R1[n]) + smooth(R1.slice().reverse(), false).replace(/^M[^C]*/, '') + ' Q' + P(sub(sh, mul(t0, w0 * 1.5))) + ' ' + P(L1[0]) + ' Z';
    var dir = o.handDir != null ? o.handDir : ang(sub(wr, c)) + (handRot || 0);
    var sl;
    if (o.body) {
      // the sleeve grows out of the top (Luyen's G19 reference, Sep 26): filled, then inked only where
      // it shows; an edge running inside the top near the shoulder isn't inked, so there is no seam
      // at the shoulder and the crease starts at the armpit
      var ink = function (E) {
        var run = [], out = '';
        E.forEach(function (q, k) {
          var hide = k <= n * 0.5 && insidePoly(q, o.body);
          if (!hide) run.push(q);
          if ((hide || k === n) && run.length) { if (run.length > 1) out += smooth(run, false) + ' '; run = []; }
        });
        return out;
      };
      // the top of the sleeve is inked unless it is wholly inside the top
      var capIn = insidePoly(L1[0], o.body) && insidePoly(R1[0], o.body) && insidePoly(sub(sh, mul(t0, w0 * 0.8)), o.body);
      sl = path(d, sleeve, 0) + path(ink(L1) + ink(R1) + (capIn ? '' : 'M' + P(L1[0]) + ' Q' + P(sub(sh, mul(t0, w0 * 1.5))) + ' ' + P(R1[0])), 'none', KTW);
    } else sl = path(d, sleeve, KTW);
    if (o.cuff === 'rib') {
      // a knit cuff: a band at the wrist with ribs
      var ca = ang(sub(wr, c)), cw2 = rot([0, w1 + 1], ca), b0 = add(wr, rot([-20, 0], ca)), b1 = add(wr, rot([-3, 0], ca)), rb = '';
      sl += path('M' + P(add(b0, cw2)) + ' L' + P(sub(b0, cw2)), 'none', 3.4);
      for (var ri = -2; ri <= 2; ri++) { var off = rot([0, ri * w1 * 0.36], ca); rb += 'M' + P(add(b0, off)) + ' L' + P(add(b1, off)) + ' '; }
      sl += path(rb, 'none', 2.2);
    } else if (o.cuff) { var cu = rot([-9, 0], ang(sub(wr, c))), cw = rot([0, w1 + 1], ang(sub(wr, c))); sl += path('M' + P(add(add(wr, cu), cw)) + ' L' + P(sub(add(wr, cu), cw)), 'none', 3.2, '', o.cuff === true ? INK : o.cuff); }
    var hd = g(humanHand(hand, skin, 5), 'translate(' + P(wr) + ') rotate(' + N(dir) + ') scale(' + hs + ')');
    return { sleeve: sl, hand: hd, svg: sl + hd, palm: add(wr, rot([13 * hs, 0], dir)), dir: dir, wr: wr };
  }

  /* ---------- feet (origin: the ankle; toe toward +x; sole at y = 32) ---------- */
  function adultFoot(kind, fill, at, r) {
    var d, x = '';
    if (kind === 'slipper') {
      d = 'M-26,20 Q-26,10 -12,10 L22,10 Q56,8 64,24 Q66,32 56,32 L-20,32 Q-28,32 -26,22 Z';
      x = path('M-18,14 q6,-5 12,0 t12,0 t12,0 t12,0 t12,0', 'none', 3);
    } else if (kind === 'boot') {
      d = 'M-26,-8 L22,-8 L24,8 Q54,8 64,22 Q66,32 56,32 L-22,32 Q-30,32 -28,24 Z';
      x = path('M-27,25 L63,25', 'none', 5);
    } else {
      d = 'M-22,0 L18,0 Q24,10 42,12 Q62,14 62,26 L62,28 Q62,32 56,32 L-22,32 Q-28,32 -28,26 L-28,6 Q-28,0 -22,0 Z';
      x = path('M20,6 l8,-4 M26,10 l8,-4', 'none', 2.6);
    }
    return g(path(d, fill, KLW) + x, 'translate(' + P(at) + ')' + (r ? ' rotate(' + N(r) + ')' : ''));
  }
  /* The legs for a stance: stand, or the two walk drawings (0: far foot forward, near foot
     back, body down; 1: passing, far leg under the body, near knee forward with its foot
     lifted behind, body up 10 px). Returns {far, near} each {hip, knee, ankle, footRot}. */
  function adultStance(walk, hipY) {
    var A = -32;
    // Luyen's references (G15, G19, G21): the near leg always leads and the far leg trails, so in
    // three-quarter view the legs make an upside-down V and never cross. The two drawings are the full
    // stride and a shorter one with the far heel lifting, so the walk still bobs.
    if (walk === 0) return { far: { hip: [-18, hipY], ankle: [-56, A - 6], footRot: 14 }, near: { hip: [18, hipY], ankle: [60, A], footRot: -6 } };
    if (walk === 1) return { far: { hip: [-18, hipY], ankle: [-30, A - 10], footRot: 18 }, near: { hip: [18, hipY], ankle: [36, A], footRot: -4 } };
    return { far: { hip: [-20, hipY], ankle: [-24, A] }, near: { hip: [20, hipY], ankle: [24, A] } };
  }
  function adultLeg(L, sp) {
    var kind = sp.legs || 'slacks', fill = sp.legFill || C.olive, w = sp.legW || 36, s = '';
    var pts = L.knee ? [L.hip, L.knee, L.ankle] : [L.hip, L.ankle];
    var d = 'M' + pts.map(function (q) { return P(q); }).join(' L');
    if (kind === 'flares') {
      // straight to the knee, then flaring out over the shoe
      var kn = L.knee || lerp2(L.hip, L.ankle, 0.52), v = sub(L.ankle, kn), vl = len(v) || 1, nv = [-v[1] / vl, v[0] / vl], hem = add(L.ankle, mul(v, 10 / vl));
      s += tube('M' + P(L.hip) + ' L' + P(kn), w - 2, fill, KTW);
      s += path('M' + P(add(kn, mul(nv, (w - 2) / 2))) + ' L' + P(add(hem, mul(nv, 31))) + ' Q' + P(add(hem, mul(v, 4 / vl))) + ' ' + P(sub(hem, mul(nv, 31))) + ' L' + P(sub(kn, mul(nv, (w - 2) / 2))) + ' Z', fill, KTW);
      s += path('M' + P(L.hip) + ' L' + P(sub(hem, mul(v, 30 / vl))), 'none', 2.4, ' opacity=".5"', C.cream);
      return { leg: s, over: true };
    }
    if (kind === 'bare') return { leg: tube(d, 24, sp.skin || C.tan, KTW) };
    s += tube(d, w, fill, KTW);
    if (kind === 'slacks') { var a = L.knee || L.hip, v2 = sub(L.ankle, a), l2 = len(v2) || 1; s += path('M' + P(add(a, mul(v2, 0.15))) + ' L' + P(add(a, mul(v2, 0.85))), 'none', 2.4, ' opacity=".5"', C.ink); }
    return { leg: s };
  }
  function lerp2(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; }

  /* ---------- tops (standing coords). The body path: shoulders at x sL, sR on y sy, hem
     corners at hL, hR on y hem, sides bowed out by bL (back) and bR (front). ---------- */
  function bodyPath(sy, hem, sL, sR, hL, hR, bL, bR) {
    var my = (sy + hem) / 2;
    return 'M' + P(sL, sy) + ' Q' + P((sL + sR) / 2, sy - 16) + ' ' + P(sR, sy) +
      ' Q' + P(sR + bR, my) + ' ' + P(hR, hem - 16) + ' Q' + P(hR + 2, hem) + ' ' + P(hR - 18, hem) +
      ' L' + P(hL + 18, hem) + ' Q' + P(hL - 2, hem) + ' ' + P(hL, hem - 16) + ' Q' + P(sL - bL, my) + ' ' + P(sL, sy) + ' Z';
  }
  /* the same outline as bodyPath, sampled into points (for telling where a sleeve overlaps the top) */
  function bodyPts(sy, hem, sL, sR, hL, hR, bL, bR) {
    var my = (sy + hem) / 2, segs = [[[sL, sy], [(sL + sR) / 2, sy - 16], [sR, sy]], [[sR, sy], [sR + bR, my], [hR, hem - 16]], [[hR, hem - 16], [hR + 2, hem], [hR - 18, hem]],
      [[hR - 18, hem], [(hR + hL) / 2, hem], [hL + 18, hem]], [[hL + 18, hem], [hL - 2, hem], [hL, hem - 16]], [[hL, hem - 16], [sL - bL, my], [sL, sy]]], pts = [];
    segs.forEach(function (q) { for (var i = 0; i < 6; i++) { var t = i / 6, u = 1 - t; pts.push([u * u * q[0][0] + 2 * u * t * q[1][0] + t * t * q[2][0], u * u * q[0][1] + 2 * u * t * q[1][1] + t * t * q[2][1]]); } });
    return pts;
  }
  function adultTop(G, sp) {
    var bp = bodyPath;
    // record the outline each top draws, so the sleeves can merge into it
    bodyPath = function (sy, hem, sL, sR, hL, hR, bL, bR) { G.bodyPts = bodyPts(sy, hem, sL, sR, hL, hR, bL, bR); G.hemY = hem; G.hemR = hR; G.hemL = hL; return bp(sy, hem, sL, sR, hL, hR, bL, bR); };
    try { return adultTopDraw(G, sp); } finally { bodyPath = bp; }
  }
  function adultTopDraw(G, sp) {
    var k = sp.top || 'windbreaker', f = sp.topFill || C.sky, sy = G.sy, hp = G.hipY, sw = G.sw, s = '', bl = sp.belly || 0;
    if (k === 'windbreaker') {
      var hem = hp + 26;
      s += path(bodyPath(sy, hem, -sw + 2, sw + 4, -sw - 22, sw + 30, 8, 16 + bl), f, KLW);
      s += path('M' + P(24, sy + 4) + ' L' + P(30, hem - 2), 'none', 3.6) + path('M' + P(-sw - 20, hem - 20) + ' L' + P(sw + 28, hem - 20), 'none', 3.4);
      s += path('M' + P(-sw + 14, sy - 4) + ' L' + P(-2, sy + 26) + ' L' + P(4, sy - 14) + ' Z', f, 5) + path('M' + P(sw - 2, sy - 2) + ' L' + P(24, sy + 26) + ' L' + P(18, sy - 14) + ' Z', f, 5);
      if ((sp.acc || []).indexOf('patch') >= 0) s += rect(34, sy + 52, 44, 30, 5, C.cream, 4);
    } else if (k === 'cardigan') {
      var hc = hp + 30;
      s += path(bodyPath(sy, hc, -sw + 2, sw + 4, -sw - 12, sw + 18, 6, 10), f, KLW);
      // the V neck with the cream shirt and its collar points, buttons, ribbed hem, pockets
      s += path('M' + P(-14, sy - 8) + ' L' + P(20, sy + 96) + ' L' + P(46, sy - 8) + ' Z', C.cream, 4.5);
      s += path('M' + P(-14, sy - 8) + ' L' + P(4, sy + 20) + ' L' + P(14, sy - 6) + ' Z M' + P(46, sy - 8) + ' L' + P(34, sy + 20) + ' L' + P(24, sy - 6) + ' Z', C.white, 4);
      s += path('M' + P(20, sy + 96) + ' L' + P(24, hc - 2), 'none', 3.6);
      [sy + 116, sy + 150, sy + 184].forEach(function (y) { s += circ(33, y, 5.5, C.cream, 3.2); });
      s += path('M' + P(-sw - 10, hc - 22) + ' L' + P(sw + 16, hc - 22), 'none', 3.4) + path('M' + P(-30, hc - 58) + ' l30,0 M' + P(46, hc - 58) + ' l30,0', 'none', 3.2);
    } else if (k === 'coat') {
      var hk = sp.hem || -190;
      s += path(bodyPath(sy, hk, -sw + 4, sw + 2, -sw - 34, sw + 40, 4, 12), f, KLW);
      s += path('M' + P(22, sy + 20) + ' L' + P(30, hk - 2), 'none', 3.6);
      [sy + 58, sy + 112, sy + 166].forEach(function (y) { s += circ(44, y, 7.5, C.mustard, 3.4); });
      // two pocket slits low on the coat (no belt line)
      s += rect(-sw - 16, hk - 64, 40, 12, 3, 'none', 3.4) + rect(44, hk - 64, 40, 12, 3, 'none', 3.4);
      s += path('M' + P(-sw + 8, sy - 6) + ' Q' + P(-18, sy + 40) + ' ' + P(8, sy + 34) + ' L' + P(20, sy - 8) + ' Z', f, 5) + path('M' + P(sw, sy - 4) + ' Q' + P(56, sy + 40) + ' ' + P(28, sy + 36) + ' L' + P(20, sy - 8) + ' Z', f, 5);
    } else if (k === 'turtleneck') {
      var ht = hp + 8;
      s += path(bodyPath(sy, ht, -sw + 2, sw + 2, -sw + 2, sw + 10, 4, 8), f, KLW);
      s += path('M' + P(-sw + 4, ht - 14) + ' L' + P(sw + 8, ht - 14), 'none', 3);
      var rib = ''; for (var x = -sw + 14; x < sw + 6; x += 14) rib += 'M' + P(x, sy + 30) + ' l2,' + N(ht - sy - 50) + ' ';
      s += path(rib, 'none', 2.2, ' opacity=".45"');
      // the rolled collar right up under the chin
      s += path('M' + P(-26, sy - 34) + ' Q' + P(8, sy - 44) + ' ' + P(44, sy - 34) + ' L' + P(48, sy + 4) + ' Q' + P(10, sy + 14) + ' ' + P(-30, sy + 4) + ' Z', f, KLW);
      s += path('M' + P(-26, sy - 16) + ' Q' + P(8, sy - 24) + ' ' + P(46, sy - 16), 'none', 3);
      // brown belt at the waist of the flares
      s += rect(-sw + 2, ht - 8, sw * 2 + 8, 18, 4, C.brown, 4.5) + rect(34, ht - 10, 24, 22, 4, C.mustard, 4);
    } else if (k === 'robe') {
      var hr = sp.hem || -150;
      s += path(bodyPath(sy, hr, -sw + 4, sw + 2, -sw - 10, sw + 16, 14, 30 + bl), f, KLW);
      // the open V at the chest (pajama cream), the shawl collar lapels crossing to the sash
      s += path('M' + P(-10, sy - 8) + ' L' + P(30, sy + 78) + ' L' + P(54, sy - 8) + ' Z', C.cream, 4.5) + path('M' + P(4, sy + 24) + ' l30,0 M' + P(14, sy + 48) + ' l24,0', 'none', 2.4, '', C.skyDeep);
      s += path('M' + P(-22, sy - 8) + ' Q' + P(4, sy + 50) + ' ' + P(30, sy + 90) + ' L' + P(48, sy + 128) + ' L' + P(20, sy + 128) + ' Q' + P(-8, sy + 60) + ' ' + P(-34, sy + 2) + ' Z', f, 5);
      s += path('M' + P(62, sy - 6) + ' Q' + P(52, sy + 44) + ' ' + P(30, sy + 90) + ' L' + P(20, sy + 128) + ' L' + P(46, sy + 128) + ' Q' + P(68, sy + 60) + ' ' + P(76, sy + 2) + ' Z', f, 5);
      // the sash and its knot with two tails, the patch pocket
      var sy2 = hp + 14;
      s += path('M' + P(-sw - 8, sy2 - 12) + ' Q' + P(10, sy2 - 20) + ' ' + P(sw + 30 + bl * 0.5, sy2 - 12) + ' L' + P(sw + 30 + bl * 0.5, sy2 + 10) + ' Q' + P(10, sy2 + 2) + ' ' + P(-sw - 8, sy2 + 10) + ' Z', f, 5);
      s += path('M' + P(44, sy2) + ' L' + P(36, sy2 + 86) + ' L' + P(54, sy2 + 84) + ' Z M' + P(50, sy2) + ' L' + P(70, sy2 + 78) + ' L' + P(84, sy2 + 70) + ' Z', f, 5) + ell(48, sy2 - 1, 11, 10, f, 5);
      var pt = Math.min(sy2 + 30, hr - 64);
      s += path('M' + P(-50, pt) + ' L' + P(4, pt) + ' L' + P(2, pt + 48) + ' Q' + P(-24, pt + 53) + ' ' + P(-48, pt + 48) + ' Z', f, 4.5);
      if ((sp.acc || []).indexOf('fishPatch') >= 0) s += g(fishIcon(0.34, C.cream), 'translate(' + P(-23, pt + 26) + ')');
    } else if (k === 'jacket') {
      var hj = hp + 10;
      s += path(bodyPath(sy, hj, -sw + 2, sw + 4, -sw - 6, sw + 12, 6, 12), f, KLW);
      s += path('M' + P(-30, sy - 26) + ' Q' + P(10, sy - 40) + ' ' + P(50, sy - 26) + ' Q' + P(56, sy - 2) + ' ' + P(44, sy + 8) + ' Q' + P(10, sy + 16) + ' ' + P(-24, sy + 8) + ' Q' + P(-38, sy - 4) + ' ' + P(-30, sy - 26) + ' Z', f, KLW);
      s += path('M' + P(24, sy + 12) + ' L' + P(28, sy + 60), 'none', 3.4);
    }
    return s;
  }
  /* Chest waders over the top: the olive bib from mid-chest down and the suspenders. */
  function wadersBib(G, sp) {
    var sy = G.sy, hp = G.hipY, sw = G.sw, f = sp.legFill || C.olive, top = sy + 96;
    G.bibPts = [[-sw + 4, top], [sw + 6, top - 4], [sw + 17, hp - 20], [sw + 14, hp + 30], [-sw - 8, hp + 30], [-sw - 10, hp - 20]];
    var s = path('M' + P(-sw + 4, top) + ' L' + P(sw + 6, top - 4) + ' Q' + P(sw + 18, hp - 40) + ' ' + P(sw + 14, hp + 30) + ' L' + P(-sw - 8, hp + 30) + ' Q' + P(-sw - 10, hp - 40) + ' ' + P(-sw + 4, top) + ' Z', f, KLW);
    s += path('M' + P(-sw + 8, top + 4) + ' Q' + P(-sw + 12, sy + 20) + ' ' + P(-sw + 22, sy - 8) + ' M' + P(sw, top) + ' Q' + P(sw - 2, sy + 20) + ' ' + P(sw - 14, sy - 10), 'none', 13, '', INK) +
      path('M' + P(-sw + 8, top + 4) + ' Q' + P(-sw + 12, sy + 20) + ' ' + P(-sw + 22, sy - 8) + ' M' + P(sw, top) + ' Q' + P(sw - 2, sy + 20) + ' ' + P(sw - 14, sy - 10), 'none', 6, '', f);
    s += rect(-sw + 2, top - 6, 16, 16, 3, C.silver, 3.4) + rect(sw - 8, top - 10, 16, 16, 3, C.silver, 3.4);
    s += rect(-4, top + 26, 44, 34, 5, f, 4);
    return s;
  }

  /* ---------- the figure ----------
     sp (the look and the stance): skin, face [rx, ry], hy (head centre y), sw (shoulder
     half-width), belly (px), hair, hairFill, capFill, top, topFill, hem, legs, legFill, legW,
     shoes, shoeFill, acc (list), browLift, mouthY; arms near / far [dx, dy, hand, handRot,
     bend, via, handDir] relative to their shoulder (or {at: [x, y], ...} absolute); walk
     0 | 1 | null; expr, mouth, blink, look, tilt. Returns the parts so a preset can layer
     props between them: {G, back, farSleeve, farHand, torso, head, nearSleeve, nearHand}. */
  function grownupParts(sp, o) {
    var exprName = o.expr && AD_EXPR[o.expr] ? o.expr : (sp.expr && AD_EXPR[sp.expr] ? sp.expr : 'neutral'), ex = AD_EXPR[exprName];
    if (sp.lid != null) { ex = Object.assign({}, ex, { lid: sp.lid }); }
    var ms = mouthState(o.mouth), lookV = o.look != null ? lookVec(o.look) : (sp.look || ex.look || [0.45, 0.05]);
    var walk = sp.walk == null ? null : (sp.walk % 2), bob = walk === 1 ? -10 : 0;
    var hy = (sp.hy || -590) + bob, sy = hy + 118, hipY = Math.round((sp.hy || -590) * 0.6 + 118 * 0.6) + bob, sw = sp.sw || 60;
    var G = { hy: hy, head: [6, hy], sy: sy, hipY: hipY, sw: sw, bob: bob, walk: walk, ex: ex, exprName: exprName };
    // the shoulders sit at the corners of the top, so both arms come from the shoulders (the far one
    // from behind the body) and never out of the chest
    G.shN = [sw + 2, sy + 14]; G.shF = [-sw + 6, sy + 14];
    G.neck = [8, sy];
    var tilt = o.tilt != null ? o.tilt : (sp.tilt || 0);
    var sk = sp.skin || C.tan, sf = sp.sleeveFill || sp.topFill || C.sky;
    function sideAt(pts, y, right) {
      var x = null;
      for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        var a = pts[i], b = pts[j];
        if ((a[1] > y) !== (b[1] > y)) { var xi = a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]); if (x == null || (right ? xi > x : xi < x)) x = xi; }
      }
      return x;
    }
    function arm(A, sh) {
      var abs = !Array.isArray(A), wr = abs ? A.at : add(sh, [A[0], A[1]]);
      // a hanging arm (hang flag) keeps its hand just outside the top (and the waders) at wrist height
      if (!abs && A[7] === 'hang') {
        var right = sh[0] > 0, pts = (G.bodyPts || []).concat(G.bibPts || []), e = pts.length ? sideAt(pts, wr[1] - 20, right) : null, m = (sp.armW1 || 13) + 12;
        if (e != null) wr = [right ? Math.max(wr[0], e + m) : Math.min(wr[0], e - m), wr[1]];
      }
      var q = abs ? [0, 0, A.hand, A.rot, A.bend, A.via, A.dir] : A;
      return adultArm(sh, wr, q[4], q[2], q[3], sf, sk, { via: q[5], handDir: q[6], cuff: sp.cuff, w0: sp.armW0, w1: sp.armW1, body: G.bodyPts, elbow: abs ? A.elbow : null, corner: G.bodyPts ? (sh[0] < 0 ? G.bodyPts[0] : G.bodyPts[6]) : null });
    }
    // the top first: the sleeves merge into its outline
    var torso = rect(-16, hy + 40, 46, sy - hy - 30, 12, sk, KTW);
    torso += adultTop(G, sp);
    if (sp.legs === 'waders') torso += wadersBib(G, sp);
    var aN = arm(sp.near || [34, 220, 'open', 0, -6, null, null, 'hang'], G.shN), aF = arm(sp.far || [-40, 212, 'open', 0, 6, null, null, 'hang'], G.shF);
    G.aN = aN; G.aF = aF;
    // legs and feet (both behind the top)
    var st = adultStance(walk, hipY), back = '';
    var headSVG = g(g(adultHead(sp, ex, o, lookV, ms), 'translate(' + P(G.head) + ')'), tilt ? 'rotate(' + N(tilt) + ' ' + P(G.neck) + ')' : '');
    ['far', 'near'].forEach(function (k) {
      var L = st[k], lg = adultLeg(L, sp), ft = adultFoot(sp.shoes || 'shoe', sp.shoeFill || C.brown, L.ankle, L.footRot || 0);
      back += lg.over ? ft + lg.leg : lg.leg + ft;
    });
    G.stance = st;
    return { G: G, back: back, farSleeve: aF.sleeve, farHand: aF.hand, torso: torso, head: headSVG, nearSleeve: aN.sleeve, nearHand: aN.hand };
  }
  function grownupAssemble(R, sp) {
    return R.back + (sp.farOnTop ? '' : R.farSleeve + R.farHand) + R.torso + R.head + (sp.farOnTop ? R.farSleeve + R.farHand : '') + R.nearSleeve + R.nearHand;
  }
  /* K.grownup(o): the shared adult. o carries the look and stance fields above plus the common
     options (x, y, scale, rot, flip, squash) and expr, mouth, blink, look, tilt. */
  K.grownup = function (o) {
    o = o || {};
    return place(o, grownupAssemble(grownupParts(o, o), o));
  };

  /* ---------------- Dot the Surveyor ----------------
     A preset of the grown-up: brown skin, gray bun, mustard visor, orange glasses framing the
     tall ovals, pencil behind the ear, sky windbreaker with a cream name patch (no lettering),
     olive slacks and brown shoes; about 695 px to the top of the bun. She holds the
     clipboard at chest height, well below her chin, with both mittens on it. */
  var DOT_LOOK = { skin: C.brown, hy: -596, sw: 60, face: [84, 90], hair: 'bun', hairFill: C.gray, top: 'windbreaker', topFill: C.sky, legs: 'slacks', legFill: C.olive, shoes: 'shoe', shoeFill: C.brown, acc: ['visor', 'glasses', 'patch'], browLift: 12, cuff: true, seed: 31 };
  // Luyen's G9 reference (Sep 26): the board a little lower, tilted, held at her near side by the near
  // hand gripping its right edge from behind (that arm hidden); the far arm comes down her side, bends,
  // and crosses in front of her to the page
  var DOT_CLIP = { c: [118, -372], sc: 0.74, rot: 8 };   // clipboard centre, scale, tilt (standing coords)
  function dotGeom(o) {
    var pose = o.pose === 'tap' ? 'tap' : 'clipboard', tf = (o.tapFrame != null ? o.tapFrame : (o.frame || 0)) % 2;
    var cb = DOT_CLIP, ca = cb.rot * rad, hw = 85 * cb.sc, hh = 110 * cb.sc;
    function onBoard(u, v) { return [cb.c[0] + u * hw * Math.cos(ca) - v * hh * Math.sin(ca), cb.c[1] + u * hw * Math.sin(ca) + v * hh * Math.cos(ca)]; }
    // both mittens on the board: in 'clipboard' the far hand grips the left edge and the near
    // hand the lower right corner; in 'tap' the far hand holds the left edge and the near
    // hand brings the pencil down on the page (frame 0 up, 1 down)
    // the near hand grips the board's right edge from behind; the far hand holds the left edge
    // (clipboard) or writes on the page (tap: frame 0 up, 1 down)
    var near = { at: add(onBoard(1, 0.18), [4, 0]), hand: 'fist', dir: 180, bend: 10 };
    var far = pose === 'tap' ? { at: add(onBoard(-0.3, 0.02), [0, tf ? 6 : -18]), hand: 'fist', dir: -30, elbow: [-58, -330] }
      : { at: add(onBoard(-0.92, 0.22), [0, 0]), hand: 'fist', dir: -14, elbow: [-58, -330] };
    return { pose: pose, tf: tf, onBoard: onBoard, near: near, far: far, top: onBoard(0, -1) };
  }
  function dotLook(o) {
    var D = dotGeom(o);
    var acc = D.pose === 'tap' ? ['visor', 'glasses', 'patch'] : ['visor', 'glasses', 'patch', 'earPencil'];
    return Object.assign({}, DOT_LOOK, { acc: acc, near: D.near, far: D.far, look: o.look != null ? lookVec(o.look) : [0.6, 0.35], expr: 'neutral' });
  }
  function dotPencil(tf) {
    // the pencil in her near fist, tip down toward the page
    return g(rect(-6, -34, 12, 72, 3, C.mustard, 4) + path('M-6,38 L0,54 L6,38 Z', C.tan, 4) + circ(0, 51, 2.5, INK, 0) + rect(-6, -44, 12, 12, 2, C.pink, 4), 'rotate(' + (tf ? -40 : -48) + ')');
  }
  K.dot = function (o) {
    o = o || {};
    var D = dotGeom(o), sp = dotLook(o), R = grownupParts(sp, o), cb = DOT_CLIP, s = '';
    // the near arm goes behind the board (only its hand shows, round the right edge); the far arm
    // crosses in front of her to the page
    s += R.back + R.torso + R.head + R.nearSleeve;
    s += g(K.clipboard({ lines: 4 }), 'translate(' + P(cb.c) + ') rotate(' + cb.rot + ') scale(' + cb.sc + ')');
    s += R.nearHand + R.farSleeve;
    if (D.pose === 'tap') s += g(dotPencil(D.tf), 'translate(' + P(R.G.aF.wr) + ')');
    s += R.farHand;
    return place(o, s);
  };
  /* Points on Dot in the parent space for the same {x, y, scale, flip, rot, pose, frame}:
     clip = the clipboard's centre (the page), clipTop = the top centre of its mustard clip,
     head = the head centre, eye = midway between the eyes, hand = the near mitten's palm. */
  K.dotPoints = function (o) {
    o = o || {};
    var D = dotGeom(o), sp = dotLook(o), R = grownupParts(sp, o), G = R.G, W = function (p) { return toParent(o, p); };
    var top = D.onBoard(0, -1), ca = DOT_CLIP.rot * rad, up = [Math.sin(ca), -Math.cos(ca)];
    return { clip: W(DOT_CLIP.c), clipTop: W(add(top, mul(up, 12 * DOT_CLIP.sc))), head: W(G.head), eye: W([G.head[0] + 20, G.head[1] - 3]), hand: W(G.aF.palm) };
  };

  /* ---------------- the exit-poll voters ----------------
     Three presets keyed by the colour s03 passes: sky = a tall man with a gray fringe and a
     push-broom mustache in a sky cardigan and gray slacks; orange = a woman with a mustard
     flip, an orange coat and a brown handbag (the voter Dot polls); avocado = a younger man
     with a round ink hairdo and sideburns, an avocado turtleneck and sky-deep flares.
     frame 0 | 1 is the two-drawing walk with the arms swinging; pose 'stand' holds still. */
  var VOTER_LOOKS = {
    sky: { skin: C.sand, hy: -636, sw: 62, face: [84, 92], hair: 'fringe', hairFill: C.gray, top: 'cardigan', topFill: C.sky, cuff: 'rib', legs: 'slacks', legFill: C.gray, shoes: 'shoe', shoeFill: C.brown, acc: ['mustache'], mustacheFill: C.gray, mouthY: 58, seed: 41 },
    orange: { skin: C.tan, hy: -566, sw: 54, face: [80, 88], hair: 'flip', hairFill: C.mustard, top: 'coat', topFill: C.orange, hem: -196, legs: 'bare', shoes: 'shoe', shoeFill: C.brick, acc: ['handbag'], seed: 43 },
    avocado: { skin: C.brown, hy: -572, sw: 58, face: [82, 90], hair: 'afro', hairFill: C.stripe, top: 'turtleneck', topFill: C.avocado, cuff: 'rib', legs: 'flares', legFill: C.skyDeep, shoes: 'shoe', shoeFill: C.brown, seed: 47 }
  };
  function voterKey(col) { return col === C.orange ? 'orange' : col === C.avocado ? 'avocado' : 'sky'; }
  /* The swinging arms for each drawing, relative to the shoulders. */
  var VOTER_ARMS = {
    stand: { near: [34, 220, 'open', 0, -6, null, null, 'hang'], far: [-40, 212, 'open', 0, 6, null, null, 'hang'] },
    0: { near: [74, 202, 'open', -8, -26, null, null, 'hang'], far: [-84, 196, 'open', 8, 22, null, null, 'hang'] },
    1: { near: [24, 216, 'open', 8, 12, null, null, 'hang'], far: [-44, 206, 'open', -8, -16, null, null, 'hang'] }
  };
  function handbag() {
    // a brown handbag hanging from the mitten by its strap (origin: the grip)
    return path('M-16,6 Q-20,40 -26,58 M16,6 Q20,40 26,58', 'none', 9) + path('M-16,6 Q-20,40 -26,58 M16,6 Q20,40 26,58', 'none', 4, '', C.brown) +
      path('M-44,58 L44,58 Q52,58 52,68 L52,112 Q52,122 42,122 L-42,122 Q-52,122 -52,112 L-52,68 Q-52,58 -44,58 Z', C.brown, KLW) +
      path('M-44,74 L44,74', 'none', 3.4) + rect(-8, 68, 16, 12, 3, C.mustard, 3.2);
  }
  K.voter = function (o) {
    o = o || {};
    var key = voterKey(o.color), look = VOTER_LOOKS[key], stand = o.pose === 'stand';
    var f = (o.frame || 0) % 2, A = stand ? VOTER_ARMS.stand : VOTER_ARMS[f];
    var lx = o.lookX == null ? 8 : o.lookX;
    var sp = Object.assign({}, look, { near: A.near, far: A.far, walk: stand ? null : f, look: o.look != null ? lookVec(o.look) : [clamp(lx / 12, -1, 1), 0.05] });
    var R = grownupParts(sp, o), s = R.back + R.farSleeve + R.farHand + R.torso + R.head;
    if (key === 'orange') s += g(handbag(), 'translate(' + P(R.G.aN.palm) + ') rotate(' + N(stand ? 0 : f ? -4 : -14) + ')');
    s += R.nearSleeve + R.nearHand;
    return place(o, s);
  };

  /* ---------------- the householder ----------------
     A home angler at his mailbox: sand skin, brown bed-head with a cowlick, a brick bathrobe
     with a cream fish on the pocket, bare shins and mustard slippers; about 650 px tall, faces
     right. pose 'mail' (both mittens hold the opened letter at his chest), 'read' (pencil up
     in the near fist, far mitten on his belly, eyes on the form ahead of him), 'think' (the
     pencil tip at his chin, the far arm across his belly under the elbow, eyes up). frame
     0 | 1: a small two-drawing move (the letter lifts, the pencil nods, the pencil taps the
     chin). No lettering on the figure. */
  var HOUSE_LOOK = { skin: C.sand, hy: -516, sw: 62, face: [88, 90], belly: 22, hair: 'tuft', hairFill: C.brown, top: 'robe', topFill: C.brick, hem: -150, legs: 'bare', shoes: 'slipper', shoeFill: C.mustard, acc: ['fishPatch'], seed: 53 };
  function houseGeom(o) {
    var pose = ['mail', 'read', 'think'].indexOf(o.pose) >= 0 ? o.pose : 'mail', f = (o.frame || 0) % 2, G = {};
    var hy = HOUSE_LOOK.hy, chin = [36, hy + 88];
    if (pose === 'mail') {
      G.letter = [128, -336 - (f ? 8 : 0)];
      G.near = { at: add(G.letter, [60, 30]), hand: 'fist', dir: 200, bend: -30 };
      G.far = { at: add(G.letter, [-62, 26]), hand: 'fist', dir: -24, via: [8, -300] };
      G.expr = 'curious'; G.look = [0.55, 0.62];
    } else if (pose === 'read') {
      // the elbow drops to his side and the forearm comes up, pencil pointing to the sky
      G.near = { at: [138, -404 - (f ? 6 : 0)], hand: 'fist', dir: -90, via: [110, -300] };
      G.far = [-30, 218, 'open', 0, 10, null, null, 'hang'];
      G.pencil = { base: G.near.at, rot: f ? -8 : 0, up: true };
      G.expr = 'curious'; G.look = [0.95, 0.35];
    } else {
      // the pencil tip rests on the chin, the fist below and forward of the jaw
      var tip = add(chin, [8, f ? 2 : 6]);
      // the near elbow rests on the far forearm, which crosses his belly
      G.near = { at: add(tip, [48, 60]), hand: 'fist', dir: -100, via: [118, -250] };
      G.far = [-30, 218, 'open', 0, 10, null, null, 'hang'];
      G.pencil = { base: G.near.at, tip: tip };
      G.expr = 'think'; G.look = [0.3, -0.95];
    }
    G.pose = pose; G.frame = f;
    return G;
  }
  function housePencil(P0) {
    // a short yellow pencil: up from the fist (read) or from the fist to the tip at the chin
    var a = P0.tip ? ang(sub(P0.tip, P0.base)) : -90 + (P0.rot || 0), L = P0.tip ? len(sub(P0.tip, P0.base)) : 96;
    var body = rect(-6, -6, L - 16, 12, 3, C.mustard, 4) + path('M' + N(L - 16) + ',-6 L' + N(L) + ',0 L' + N(L - 16) + ',6 Z', C.tan, 4) + circ(L - 2, 0, 2.2, INK, 0) + rect(-18, -6, 14, 12, 2, C.pink, 4);
    return g(body, 'translate(' + P(P0.base) + ') rotate(' + N(a) + ')');
  }
  function houseLetter(c) {
    // the opened letter: the envelope with the survey sheet pulled up out of it (no lettering)
    var s = rect(-58, -64, 116, 110, 6, C.white, 5) + path('M-40,-44 h56 M-40,-28 h72 M-40,-12 h64 M-40,4 h48', 'none', 3.2) + rect(-40, 12, 12, 12, 2, 'none', 3) + rect(-40, 28, 12, 12, 2, 'none', 3);
    s += g(K.envelope({ open: 1 }), 'translate(0 38) scale(0.6)');
    return g(s, 'translate(' + P(c) + ') rotate(-4)');
  }
  K.householder = function (o) {
    o = o || {};
    var H = houseGeom(o), sp = Object.assign({}, HOUSE_LOOK, { near: H.near, far: H.far, expr: H.expr, look: H.look, sleeveFill: C.brick, cuff: C.ink });
    var R = grownupParts(sp, o), s;
    if (H.pose === 'mail') s = R.back + R.torso + R.head + R.farSleeve + R.nearSleeve + houseLetter(H.letter) + R.farHand + R.nearHand;
    else {
      // the far arm hangs at his far side, behind the robe
      s = R.back + R.farSleeve + R.farHand + R.torso + R.head;
      if (H.pose === 'read') s += housePencil(H.pencil) + R.nearSleeve + R.nearHand;
      else s += R.nearSleeve + housePencil(H.pencil) + R.nearHand;
    }
    return place(o, s);
  };

  /* ---------------- the ramp angler ----------------
     Just off the water: tan skin, short brown hair under a sea ball cap, an orange rain jacket,
     olive chest waders with suspenders and boots, the rod over his far shoulder (the far
     mitten holds the grip at his chest); about 660 px tall, faces right. pose 'stand' (near
     mitten at his side), 'talk' (near mitten open, palm up, at his chest), 'point' (the near
     arm aims a pointing mitten forward and down at a cooler; aim = degrees below level,
     default 24). frame 0 | 1: a small two-drawing move of the near hand. */
  // Luyen's G13 reference (Sep 26): an orange turtleneck with ribbed cuffs under the waders; the far
  // hand holds the rod at his chest, the elbow bent low at his side, the rod rising past his ear
  var RAMP_LOOK = { skin: C.tan, hy: -540, sw: 62, face: [84, 90], hair: 'cap', hairFill: C.brown, capFill: C.sea, top: 'turtleneck', topFill: C.orange, cuff: 'rib', legs: 'waders', legFill: C.olive, legW: 46, shoes: 'boot', shoeFill: C.olive, seed: 59 };
  function rampGeom(o) {
    var pose = ['stand', 'talk', 'point'].indexOf(o.pose) >= 0 ? o.pose : 'stand', f = (o.frame || 0) % 2, G = {};
    var sy = RAMP_LOOK.hy + 118, shN = [RAMP_LOOK.sw + 2, sy + 14];
    G.far = { at: [-26, -388], hand: 'fist', dir: 0, via: [-106, -326] };
    if (pose === 'talk') { G.near = { at: [164, -352 - (f ? 14 : 0)], hand: 'open', dir: -62, via: [104, -304] }; G.expr = 'talk'; }
    else if (pose === 'point') { var aim = o.aim == null ? -4 : o.aim; G.near = { at: add(shN, rot([196 + (f ? 10 : 0), 0], aim)), hand: 'point', dir: aim, bend: aim > 90 ? 10 : -4 }; G.expr = 'neutral'; G.look = aim > 90 ? [0.9, 0.55] : [1, 0]; }
    else { G.near = [30 + (f ? 4 : 0), 214, 'open', 0, -6, null, null, 'hang']; G.expr = 'neutral'; }
    G.pose = pose; G.frame = f;
    return G;
  }
  function rampRod(grip) {
    // a plain pole rod held in the far fist: the butt just below the fist, the pole rising up and back
    // past his ear, a short line and a red-and-white bobber at the tip
    var a = -118, tip = add(grip, rot([500, 0], a)), butt = add(grip, rot([-44, 0], a));
    var s = tube('M' + P(butt) + ' L' + P(tip), 12, C.brown, 4) + tube('M' + P(butt) + ' L' + P(add(grip, rot([16, 0], a))), 14, C.tan, 4);
    s += path('M' + P(tip) + ' L' + P(add(tip, [2, 70])), 'none', 2.6);
    var bb = add(tip, [2, 84]);
    s += path('M' + P(add(bb, [-9, 0])) + ' A9,9 0 0 1 ' + P(add(bb, [9, 0])) + ' Z', C.white, 3) + path('M' + P(add(bb, [-9, 0])) + ' A9,9 0 0 0 ' + P(add(bb, [9, 0])) + ' Z', C.brick, 3);
    return s;
  }
  K.rampAngler = function (o) {
    o = o || {};
    var A = rampGeom(o), sp = Object.assign({}, RAMP_LOOK, { near: A.near, far: A.far, expr: A.expr, look: A.look, cuff: true });
    var R = grownupParts(sp, o);
    // the rod rests on his far shoulder (over the sleeve), under the fist that grips it, and
    // runs back under his ear and behind his head, clear of the face
    // the far arm comes in front of him to the rod; the rod passes over his ear, under the fist
    var s = R.back + R.torso + R.farSleeve + R.head + rampRod(R.G.aF.palm) + R.farHand + R.nearSleeve + R.nearHand;
    return place(o, s);
  };
  K.HOUSEHOLDER_POSES = ['mail', 'read', 'think'];
  K.RAMP_POSES = ['stand', 'talk', 'point'];

  /* ======================================================================
     THE SCHOOL (three juvenile stripers) and BIG MAMA
     ====================================================================== */
  var SCH_SPINE = {
    stand: [[-10, -66], [-14, -146], [8, -212], [96, -226]],
    sing: [[-8, -66], [-10, -154], [12, -232], [90, -262]],
    swim: [[-116, -54], [-40, -60], [40, -60], [118, -54]],
    leap: [[-110, -30], [-44, -96], [44, -96], [112, -34]]
  };
  var SCH_POSE = {
    neutral: { spine: 'stand', near: [30, 60, 'open', 0, -8], far: [-16, 58, 'open', 0, 8], expr: 'neutral' },
    sing: { spine: 'sing', near: [76, 20, 'open', -50, -18], far: [-66, -6, 'open', 30, 14], expr: 'sing' },
    jazz: { spine: 'sing', near: [96, 22, 'jazz', -40, -16], far: [-74, -40, 'jazz', 20, 14], expr: 'sing' },
    shake: { spine: 'stand', near: [30, 60, 'open', 0, -8], far: [-16, 58, 'open', 0, 8], expr: 'shut' },
    toast: { spine: 'sing', near: [84, -40, 'grip', -90, -20], far: [-16, 58, 'open', 0, 8], expr: 'happy' },
    // the toast lifted up (s14 'Here's to someday!'): the far fin raised overhead from behind
    // the head, tipped a little forward, the near fin down at the side, so no fin crosses the
    // face or the next fish in a row
    raise: { spine: 'sing', near: [30, 60, 'open', 0, -8], far: [30, -175, 'open', -90, 18], expr: 'happy' },
    peek: { spine: 'stand', near: [76, 14, 'grip', 60, -12], far: [-44, 10, 'grip', 100, 12], expr: 'neutral' },
    swim: { spine: 'swim', near: [-18, 36, 'open', 40, 8], far: [-26, 28, 'open', 40, 8], expr: 'neutral' },
    leap: { spine: 'leap', near: [-24, 34, 'open', 30, 8], far: [-30, 26, 'open', 30, 8], expr: 'happy' }
  };
  var SCH_EXPR = {
    neutral: { lid: 0, pupil: 0.44, mouth: 'smile', brow: 'up' },
    sing: { lid: 0, pupil: 0.44, mouth: 'smile', brow: 'high' },
    happy: { lid: 0, lower: 0.3, pupil: 0.44, mouth: 'smile', brow: 'up' },
    shut: { wink: true, mouth: 'smile', brow: 'up' },
    surprised: { lid: 0, pupil: 0.3, eyeScale: 1.08, mouth: 'o', brow: 'high' }
  };
  var SCHOOL_TIES = [C.mustard, C.orange, C.avocado];
  function bowTie(col, sz) {
    return union(['<path d="M0,0 L-22,-14 L-22,14 Z"/>', '<path d="M0,0 L22,-14 L22,14 Z"/>'], col, 3.5 * sz) + circ(0, 0, 6.5, col, 4) +
      path('M-14,-5 L-14,5 M14,-5 L14,5', 'none', 2.6);
  }
  K.bowTie = function (o) { o = o || {}; return place(o, bowTie(o.color || C.mustard, 1)); };
  var SCHOOL_SPEC = {
    size: 1, poses: SCH_POSE, exprs: SCH_EXPR, defPose: 'neutral',
    spine: function (name, o) {
      var S = SCH_SPINE[name].map(function (p) { return p.slice(); });
      if (name === 'swim' || name === 'leap') { var w = Math.sin((o.phase || 0) * Math.PI * 2) * 8; S[1][1] += w; S[2][1] -= w; }
      if (o.pose === 'shake') { var fr = (o.frame || 0) % 2 ? 1 : -1; S[3][1] += fr * 8; S[2][0] += fr * 5; }
      return S;
    },
    wb: table([[0, 13], [0.12, 17], [0.35, 40], [0.6, 56], [0.78, 56], [0.9, 46], [0.97, 30], [1, 14]]),
    wv: table([[0, 12], [0.12, 15], [0.35, 38], [0.6, 52], [0.78, 50], [0.9, 40], [0.97, 26], [1, 10]]),
    bodyFill: C.silver, backFill: C.seaDeep, bellyFill: C.cream, finFill: C.silver, jawFill: C.cream, lidFill: C.silver, eyeStyle: 'retro',
    backQ: -0.74, bellyQ: 0.5, stripes: 4, stripeQ: [-0.5, 0.26], stripeS: [0.12, 0.68], stripeW: 0.06, gillS: 0.7,
    eye: [0.84, -0.4], eyeR: 30, shoulder: [0.62, 0.3], handSize: 0.72, mouthSize: 0.62, hook: false, hat: false,
    dorsal1: [0.46, 0.62, [18, 30, 32, 26, 14]], dorsal2: [0.24, 0.4, [14, 24, 24, 16]], anal: [0.2, 0.3, [12, 20, 16]], tailLen: 0.64,
    extraHead: function () { return ''; },
    /* the bow tie sits under the chin on top of the fins, so the tie order always reads */
    onTop: function (rig, fr, a, sc, o) {
      if (o.tie === false) return '';
      var col = typeof o.tie === 'string' ? o.tie : SCHOOL_TIES[(o.tie || 0) % 3];
      var p = rig.at(0.72, 0.92);
      return g(bowTie(col, 1), 'translate(' + P(p) + ') rotate(' + N(a + 70) + ') scale(0.9)');
    }
  };
  /* Schoolie mouth: a round "oo" singing mouth tucked down and back under the snout (so it
     never reads as a nose), and a short line when closed. */
  K.schoolie = function (o) {
    o = o || {};
    var ms = mouthState(o.mouth);
    var spec = Object.assign({}, SCHOOL_SPEC);
    var baseExtra = spec.extraHead;
    spec.extraHead = function (rig, fr, a, sc, oo, ex) {
      var m = '', c = fr(-30, 24);
      if (ms === 'open') m = g(ell(0, 2, 12, 16, INK, 4.5) + ell(1, 10, 7, 5, C.pink, 0), 'translate(' + P(c) + ') rotate(' + N(a) + ')');
      else if (ms === 'mid') m = g(ell(0, 0, 9, 10, INK, 4.5), 'translate(' + P(c) + ') rotate(' + N(a) + ')');
      else if (ex.mouth === 'o') m = g(ell(0, 0, 7, 8, INK, 4), 'translate(' + P(c) + ') rotate(' + N(a) + ')');
      else m = path('M' + P(fr(-40, 20)) + ' Q' + P(fr(-30, 27)) + ' ' + P(fr(-19, 20)), 'none', 5);
      return m + baseExtra(rig, fr, a, sc, oo, ex);
    };
    spec.jawFill = null;
    return fishFigureNoJaw(o, spec);
  };
  function fishFigureNoJaw(o, spec) {
    var oo = Object.assign({}, o); oo.mouth = false;
    spec.noJaw = true;
    return fishFigure(oo, spec);
  }
  /* The three Schoolies in bow-tie order (mustard, orange, avocado), left to right.
     T = global seconds for the bob (offset one beat per fish). gap = spacing. */
  K.school = function (o) {
    o = o || {};
    var s = '', gap = o.gap || 240, beat = 60 / 104;
    for (var i = 0; i < 3; i++) {
      var b = o.T != null ? K.beat(o.T - i * beat) : 0;
      var oi = Object.assign({}, o, { x: (i - 1) * gap, y: -b * 14 * (o.bob == null ? 1 : o.bob), tie: o.flip ? 2 - i : i, scale: 1, flip: false, rot: 0, squash: 0, blink: o.blink ? K.blink(o.T || 0, i + 3) : false });
      var k = o.flip ? 2 - i : i;
      if (o.poses) oi.pose = o.poses[k];
      if (o.mouths) oi.mouth = o.mouths[k];
      if (o.frames) oi.frame = o.frames[k];
      s += K.schoolie(oi);
    }
    return place(o, s);
  };

  /* Big Mama: 1.4x the Striper, rounder cream belly, a knotted orange headscarf, EGGS ON BOARD
     tag. She has the family's 70s eye (spec.eyeStyle 'retro': white oval, solid pupil, silver
     lids) at 0.9 of its size, with her own three ink lashes on the lid line and her own low
     brow that fits the forehead under the crown; the pink cheek stays. The headscarf is a
     narrow band over the crown, behind the eye with silver head showing between them, down to
     a knot under the chin behind and below the mouth: nothing crosses her eye, brow or mouth. */
  var MAMA_POSE = {
    glide: { spine: 'swim', near: [-30, 58, 'open', 40, 10], far: [-44, 44, 'open', 40, 10], expr: 'proud' },
    chinUp: { spine: 'chin', near: [-30, 58, 'open', 40, 10], far: [-44, 44, 'open', 40, 10], expr: 'chin' }
  };
  var MAMA_EXPR = {
    proud: { lid: 0.16, lower: 0.2, eyeScale: 0.9, lashes: true, mouth: 'smile', brow: 'up', look: [0.8, -0.1] },
    chin: { wink: false, lid: 0.62, eyeScale: 0.9, lashes: true, mouth: 'smile', brow: 'up', look: [0.6, -0.6] }
  };
  /* her brow in eye radii (see BROWS): a low arch just over the eye, inside the head outline */
  var MAMA_BROWS = { up: [-0.48, -1.02, 0.04, -1.4, 0.48, -0.96] };
  /* Three ink lashes on the lid line at the eye's back corner (for the blink they hang from the
     low lid line). Same eye geometry as retroEye; drawn over the eye. */
  function mamaLashes(E, r, a, e, sw) {
    var es = e.eyeScale || 1, rx = r * 0.9 * es, ry = r * 1.07 * es;
    var lid = e.blink ? 1 : clamp(e.lid || 0, 0, 1), p0, c, p2, up = -1;
    if (lid >= 0.98) { p0 = [-rx * 0.94, ry * 0.08]; c = [0, ry * 0.34]; p2 = [rx * 0.94, ry * 0.08]; up = 1; }
    else {
      var d = lid > 0.001 ? -ry + 2 * ry * lid : -ry * 0.72, xc = rx * Math.sqrt(Math.max(1 - d * d / (ry * ry), 0));
      p0 = [-xc, d]; c = [0, d + (lid > 0.001 ? ry * 0.1 : -ry * 0.5)]; p2 = [xc, d];
    }
    var s = '';
    // fanned out from the lid line's back corner, past the oval: the first lash sweeps back
    // almost level, the third stands up
    [[0, 12], [0.07, 40], [0.14, 68]].forEach(function (k) {
      var t = k[0], u = 1 - t, p = [u * u * p0[0] + 2 * u * t * c[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p2[1]];
      var tg = [2 * u * (c[0] - p0[0]) + 2 * t * (p2[0] - c[0]), 2 * u * (c[1] - p0[1]) + 2 * t * (p2[1] - c[1])], tl = len(tg) || 1;
      tg = [tg[0] / tl, tg[1] / tl];
      var nv = up < 0 ? [tg[1], -tg[0]] : [-tg[1], tg[0]], th = k[1] * rad, dv = add(mul(tg, -Math.cos(th)), mul(nv, Math.sin(th))), L = ry * 0.44;
      var q = add(p, mul(dv, L)), m = add(add(p, mul(dv, L * 0.55)), mul(nv, L * 0.12));
      s += path('M' + P(p) + ' Q' + P(m) + ' ' + P(q), 'none', sw * 0.85);
    });
    return g(s, 'translate(' + P(E) + ') rotate(' + N(a) + ')');
  }
  var MAMA_SPEC = {
    size: 1.4, poses: MAMA_POSE, exprs: MAMA_EXPR, defPose: 'glide',
    spine: function (name, o) {
      var S = name === 'chin' ? [[-180, -70], [-60, -84], [60, -100], [178, -128]] : STR_SPINE.swim.map(function (p) { return p.slice(); });
      var w = Math.sin((o.phase || 0) * Math.PI * 2) * 10; S[1][1] += w; S[2][1] -= w;
      return S;
    },
    wb: SW_B, wv: table([[0, 18], [0.1, 24], [0.3, 60], [0.5, 86], [0.66, 88], [0.78, 76], [0.88, 60], [0.95, 42], [1, 14]]),
    bodyFill: C.silver, backFill: C.seaDeep, bellyFill: C.cream, finFill: C.silver, jawFill: C.cream, lidFill: C.silver, eyeStyle: 'retro',
    backQ: -0.72, backEnd: [0.66, 0.78], bellyQ: 0.36, stripes: 7, stripeQ: [-0.56, 0.26], stripeS: [0.08, 0.72], stripeW: 0.034, gillS: 0.73,
    eye: [0.875, -0.44], eyeR: 34, shoulder: [0.64, 0.3], handSize: 1.1, mouthSize: 1, hook: false, hat: false, cheek: true,
    browSet: MAMA_BROWS, browW: 1.1,
    dorsal1: [0.5, 0.67, [34, 56, 60, 52, 40, 22]], dorsal2: [0.25, 0.42, [22, 40, 44, 38, 26]], anal: [0.2, 0.33, [18, 34, 36, 26]], tailLen: 1,
    preHead: function (rig, fr, a, sc, o) {
      var s = '', k = sc / 1.4, F = function (x, y) { return fr(x * k, y * k); };
      // the headscarf: a narrow band over the crown and down behind the eye (head frame, px
      // back from the snout / down), silver head between it and the eye, knotted under the chin
      var band = [[-106, -132], [-113, -100], [-119, -50], [-123, 0], [-125, 44], [-121, 88], [-148, 96], [-153, 48], [-159, -6], [-170, -62], [-186, -102], [-200, -124], [-152, -142]].map(function (p) { return F(p[0], p[1]); });
      s += path(smooth(band, true, 0.85), C.orange, LW * sc * 0.72);
      s += path('M' + P(F(-128, -128)) + ' Q' + P(F(-150, -80)) + ' ' + P(F(-140, -20)), 'none', 3 * sc);
      [[-140, -112], [-176, -114], [-154, -64], [-141, -6], [-138, 48]].forEach(function (d) { var p = F(d[0], d[1]); s += circ(p[0], p[1], 5.5 * sc, C.mustard, 0); });
      // the knot under the chin with two short tails hanging back
      var kn = F(-134, 104);
      s += path('M' + P(F(-140, 110)) + ' Q' + P(F(-160, 130)) + ' ' + P(F(-170, 150)) + ' L' + P(F(-152, 152)) + ' Q' + P(F(-146, 132)) + ' ' + P(F(-132, 114)) + ' Z', C.orange, 4 * sc);
      s += path('M' + P(F(-128, 112)) + ' Q' + P(F(-132, 136)) + ' ' + P(F(-128, 156)) + ' L' + P(F(-112, 150)) + ' Q' + P(F(-116, 130)) + ' ' + P(F(-120, 110)) + ' Z', C.orange, 4 * sc);
      s += g(union(['<ellipse cx="-16" cy="0" rx="16" ry="10" transform="rotate(24 -16 0)"/>', '<ellipse cx="16" cy="0" rx="16" ry="10" transform="rotate(-24 16 0)"/>', '<circle cx="0" cy="0" r="9"/>'], C.orange, 4) + circ(-14, 2, 3, C.mustard, 0) + circ(14, 2, 3, C.mustard, 0), 'translate(' + P(kn) + ') rotate(' + N(a) + ') scale(' + N(sc * 0.8) + ')');
      // dart tag trailing from the soft dorsal fin
      var ft = rig.at(0.33, -1.2), tp = add(ft, rot([-56 * sc, -58 * sc], 0));
      s += path('M' + P(ft) + ' Q' + P(ft[0] - 10 * sc, ft[1] - 40 * sc) + ' ' + P(tp[0] + 30 * sc, tp[1]), 'none', 3.4 * sc);
      s += unflip(g(K.tag('EGGS ON BOARD', 0, 0, { size: 24, fill: C.tan }), 'translate(' + P(tp) + ') rotate(-6) scale(' + N(sc * 0.72 * (o.tagScale || 1)) + ')'), o.flip, tp[0], tp[1]);
      return s;
    },
    extraHead: function (rig, fr, a, sc, o, ex) { return ex.lashes ? mamaLashes(rig.at(0.875, -0.44), 34 * sc, a, ex, 6 * sc) : ''; }
  };
  K.bigMama = function (o) { return fishFigure(o || {}, MAMA_SPEC); };
  K.SCHOOL_POSES = Object.keys(SCH_POSE);
  K.MAMA_POSES = Object.keys(MAMA_POSE);

  /* ======================================================================
     PROPS
     ====================================================================== */
  function wrapLines(str, n) { return K.wrap(str, n); }
  function multiText(str, x, y, size, maxChars, o) {
    var rows = wrapLines(str, maxChars), s = '', lh = size * 1.12, y0 = y - (rows.length - 1) * lh / 2;
    rows.forEach(function (r, i) { s += K.text(r, x, y0 + i * lh + size * 0.35, Object.assign({ size: size }, o || {})); });
    return s;
  }

  /* --- small effects --- */
  K.qmark = function (o) { o = o || {}; return place({ x: o.x, y: o.y, scale: o.scale, rot: o.rot == null ? 6 : o.rot }, K.text('?', 0, 0, { size: o.size || 120, font: 'title', fill: o.color || C.brick, stroke: INK, strokeW: (o.size || 120) * 0.1 })); };
  K.check = function (o) { o = o || {}; return place(o, tube('M-30,2 L-8,26 L34,-28', 16, o.color || C.cream, 5.5)); };
  K.xmark = function (o) { o = o || {}; return place(o, tube('M-40,-40 L40,40 M40,-40 L-40,40', 20, o.color || C.brick, 6)); };
  function star4(r, fill, sw) { var a = r * 0.22; return path('M0,' + (-r) + ' Q' + a + ',' + (-a) + ' ' + r + ',0 Q' + a + ',' + a + ' 0,' + r + ' Q' + (-a) + ',' + a + ' ' + (-r) + ',0 Q' + (-a) + ',' + (-a) + ' 0,' + (-r) + ' Z', fill, sw); }
  K.sparkle = function (o) { o = o || {}; var r = o.r || 46; return place(o, star4(r, C.white, 5) + g(star4(r * 0.42, C.white, 4), 'translate(' + N(r * 0.95) + ' ' + N(-r * 0.7) + ')') + g(star4(r * 0.3, C.white, 3.5), 'translate(' + N(-r * 0.85) + ' ' + N(r * 0.75) + ')')); };
  K.puff = function (o) {
    o = o || {}; var r = o.r || 40, seed = o.seed || 1, sh = ['<circle cx="0" cy="0" r="' + N(r * 0.8) + '"/>'];
    for (var i = 0; i < 6; i++) { var a = i / 6 * Math.PI * 2 + seed; sh.push('<circle cx="' + N(Math.cos(a) * r * 0.62) + '" cy="' + N(Math.sin(a) * r * 0.5) + '" r="' + N(r * (0.42 + hash(seed + i) * 0.14)) + '"/>'); }
    return place(o, union(sh, o.fill || C.cream, 5));
  };
  K.splash = function (o) {
    o = o || {}; var n = o.n || 5, r = o.r || 80, p = o.p == null ? 1 : o.p, s = '';
    for (var i = 0; i < n; i++) {
      var a = -150 + 120 * (n === 1 ? 0.5 : i / (n - 1)), d = r * (0.5 + 0.5 * p) * (0.8 + hash(i + 3) * 0.4);
      var q = rot([d, 0], a);
      s += g(path('M0,-18 Q12,0 0,10 Q-12,0 0,-18 Z', o.fill || C.cream, 4.5), 'translate(' + P(q) + ') rotate(' + N(a + 90) + ')');
    }
    return place(o, s);
  };
  K.speedLines = function (o) {
    o = o || {}; var n = o.n || 3, l = o.len || 120, gp = o.gap || 26, d = '';
    for (var i = 0; i < n; i++) { var y = (i - (n - 1) / 2) * gp, ll = l * (i % 2 ? 0.7 : 1); d += 'M0,' + N(y) + ' L' + N(-ll) + ',' + N(y) + ' '; }
    return place(o, path(d, 'none', o.w || 6));
  };
  K.impact = function (o) { o = o || {}; var r = o.r || 50; return place(o, K.starburst(0, 0, r, r * 0.5, o.n || 8, o.fill || C.brick, o.spin || 0.2)); };

  /* --- cards, signs, tags --- */
  K.card = function (o) {
    o = o || {};
    var w = o.w || 300, h = o.h || 150, st = o.style || (o.ghost ? 'ghost' : o.check ? 'corrected' : 'plain'), s = '';
    if (st === 'ghost') return place(o, rect(-w / 2, -h / 2, w, h, 16, 'none', 6, DASH, C.gray).replace('stroke="' + INK + '"', 'stroke="' + C.gray + '"'));
    var fill = o.fill || (st === 'corrected' ? C.sea : C.cream), col = o.color || (st === 'corrected' ? C.cream : INK);
    s += rect(-w / 2, -h / 2, w, h, 16, fill, PW);
    if (o.label) s += multiText(o.label, 0, 0, o.size || 44, o.chars || Math.max(6, Math.floor(w / ((o.size || 44) * 0.55))), { font: o.font || 'label', fill: col });
    if (st === 'corrected') s += g(tube('M-30,2 L-8,26 L34,-28', 14, C.cream, 5), 'translate(' + N(w / 2 - 20) + ' ' + N(-h / 2 + 10) + ') scale(0.8)');
    return place(o, s);
  };
  function postSVG(h, w, kind) {
    if (kind === 'stake') return path('M-9,' + (-h) + ' L9,' + (-h) + ' L9,-14 L0,0 L-9,-14 Z', C.brown, PW);
    return rect(-(w || 16), -h, (w || 16) * 2, h, 3, C.brown, PW) + path('M-4,' + N(-h * 0.7) + ' l3,20 M5,' + N(-h * 0.35) + ' l-2,16', 'none', 3);
  }
  K.sign = function (o) {
    o = o || {};
    var w = o.w || 300, h = o.h || 110, ph = o.post === 'none' ? 0 : (o.postH == null ? 160 : o.postH), s = '';
    if (ph) s += postSVG(ph + h / 2, 12, o.post || 'post');
    var bx = -w / 2, by = -ph - h;
    if (o.dashed) s += rect(bx, by, w, h, 12, o.fill || C.gray, 0) + rect(bx, by, w, h, 12, 'none', 6, DASH).replace('stroke="' + INK + '"', 'stroke="' + INK + '"');
    else s += rect(bx, by, w, h, 12, o.fill || C.cream, PW);
    s += path('M' + N(bx + 14) + ',' + N(by + 14) + ' l0,0 M' + N(-bx - 14) + ',' + N(by + 14) + ' l0,0', 'none', 8);
    if (o.label) s += multiText(o.label, 0, by + h / 2, o.size || 46, o.chars || Math.max(5, Math.floor((w - 20) / ((o.size || 46) * 0.55))), { font: o.font || 'label', fill: o.color || INK });
    return place(o, s);
  };
  K.tallyBoard = function (o) {
    o = o || {};
    var notch = o.notch || 34, n = o.notches || 5, drop = o.drop || 0, H = 150 + n * notch, s = '';
    s += path('M-10,' + (-H) + ' L10,' + (-H) + ' L10,-16 L0,0 L-10,-16 Z', C.brown, PW);
    var d = ''; for (var i = 0; i < n; i++) d += 'M-16,' + N(-H + 90 + i * notch) + ' L16,' + N(-H + 90 + i * notch) + ' ';
    s += path(d, 'none', 4);
    var y = -H + 40 + drop * notch, w = o.w || 230;
    s += rect(-w / 2, y - 46, w, 92, 10, o.fill || C.cream, PW) + K.text(o.label || 'TRIPS', 0, y + 15, { size: o.size || 44, font: 'label' });
    s += path('M' + N(-w / 2 + 20) + ',' + N(y - 34) + ' l0,0 M' + N(w / 2 - 20) + ',' + N(y - 34) + ' l0,0', 'none', 7);
    return place(o, s);
  };

  /* --- the teaching icons --- */
  K.tripToken = function (o) {
    o = o || {};
    var r = o.r || 30, ghost = o.ghost, stray = o.stray, s = '';
    var ic = ghost ? C.gray : INK;
    s += circ(0, 0, r, ghost ? 'none' : C.mustard, ghost || stray ? 5 : 5.5, ghost || stray ? ' stroke-dasharray="8 6"' : '').replace('stroke="' + INK + '"', 'stroke="' + (ghost || stray ? C.gray : INK) + '"');
    if (o.kind === 'rod') s += path('M' + N(-r * 0.55) + ',' + N(r * 0.45) + ' Q0,' + N(r * 0.2) + ' ' + N(r * 0.55) + ',' + N(r * 0.45) + ' M' + N(-r * 0.1) + ',' + N(r * 0.35) + ' L' + N(r * 0.35) + ',' + N(-r * 0.6) + ' M' + N(r * 0.35) + ',' + N(-r * 0.6) + ' q' + N(r * 0.18) + ',' + N(r * 0.4) + ' 0,' + N(r * 0.7), 'none', 3.4, '', ic);
    else s += path('M' + N(-r * 0.6) + ',' + N(r * 0.1) + ' L' + N(r * 0.6) + ',' + N(r * 0.1) + ' L' + N(r * 0.4) + ',' + N(r * 0.42) + ' L' + N(-r * 0.42) + ',' + N(r * 0.42) + ' Z M' + N(-r * 0.05) + ',' + N(r * 0.1) + ' L' + N(-r * 0.05) + ',' + N(-r * 0.62) + ' L' + N(r * 0.42) + ',' + N(0) + ' Z', ghost ? 'none' : C.cream, 3.4, '', ic);
    return place(o, s);
  };
  function fishIcon(size, fill) {
    size = size || 1;
    var body = 'M40,0 Q28,-20 0,-18 Q-22,-16 -34,-4 L-50,-18 Q-46,0 -50,18 L-34,4 Q-22,16 0,18 Q28,20 40,0 Z';
    return g(path(body, fill || C.silver, 5.5) + path('M-20,-5 Q4,-9 24,-4 M-20,5 Q4,9 22,6', 'none', 4, '', C.stripe) + circ(24, -5, 4, INK, 0), size !== 1 ? 'scale(' + size + ')' : '');
  }
  K.fishIcon = function (o) { o = o || {}; return place(o, fishIcon(o.size || 1, o.fill)); };
  function schoolShape(w, h) {
    var hw = w / 2, hh = h / 2;
    return 'M' + P(hw, 0) + ' C' + P(hw, -hh * 0.9) + ' ' + P(-hw * 0.2, -hh * 1.12) + ' ' + P(-hw * 0.62, -hh * 0.3) +
      ' L' + P(-hw, -hh * 0.78) + ' Q' + P(-hw * 0.84, 0) + ' ' + P(-hw, hh * 0.78) + ' L' + P(-hw * 0.62, hh * 0.3) +
      ' C' + P(-hw * 0.2, hh * 1.12) + ' ' + P(hw, hh * 0.9) + ' ' + P(hw, 0) + ' Z';
  }
  /* The ESTIMATED SCHOOL: a chalk outline shaped like one big fish with a fixed cluster of
     small fish icons inside. tight 0..1 redraws the outline tighter (sky -> sea) while the
     old size stays behind as a gray dashed ghost. The fish never move. */
  K.estimatedSchool = function (o) {
    o = o || {};
    var w = o.w || 460, h = o.h || 250, t = clamp(o.tight || 0, 0, 1), k = lerp(1, o.minScale || 0.72, t), s = '';
    var ghost = o.ghost != null ? o.ghost : t > 0;
    if (ghost) s += path(schoolShape(w, h), 'none', 7, ' stroke-dasharray="16 12"', C.gray);
    var col = t > 0 ? C.sea : C.sky;
    // o.fill (default none) paints inside the current outline only, so a busy background
    // (a horizon, a sun) never runs through the fish; the ghost always stays unfilled
    s += g((o.fill ? path(schoolShape(w, h), o.fill, 0) : '') + path(schoolShape(w, h), 'none', 20, '', INK) + path(schoolShape(w, h), 'none', 10, '', col), 'scale(' + N(k * 1000) / 1000 + ')');
    var n = o.n || 15, pts = [], seed = o.seed || 1, tries = 0;
    while (pts.length < n && tries < 400) {
      tries++;
      var a = hash(seed * 7.1 + tries * 1.9) * Math.PI * 2, rr = Math.sqrt(hash(seed * 3.3 + tries * 2.7));
      var p = [0.05 * w + Math.cos(a) * rr * w * 0.25, Math.sin(a) * rr * h * 0.2];
      if (pts.every(function (q) { return Math.abs(q[0] - p[0]) > 44 * (o.fishSize || 0.55) * 1.6 || Math.abs(q[1] - p[1]) > 24 * (o.fishSize || 0.55) * 1.6; })) pts.push(p);
    }
    pts.sort(function (a, b) { return a[1] - b[1]; }).forEach(function (p) { s += g(fishIcon(o.fishSize || 0.55), 'translate(' + P(p) + ')'); });
    if (o.label) s += K.tag(o.label, 0, -h / 2 - 50, { size: o.labelSize || 34 });
    return place(o, s);
  };


  /* --- THE COUNT pencil and the pencil sharpener (every chorus) --- */
  K.pencil = function (o) {
    o = o || {};
    var L = o.len || 420, hw = 36, sh = clamp(o.sharp == null ? 1 : o.sharp, 0, 1), tipL = lerp(40, 110, sh), bodyL = L - tipL, x0 = -L / 2, s = '';
    s += rect(x0 - 34, -hw, 40, hw * 2, 12, C.pink, PW);
    s += rect(x0, -hw - 2, 46, hw * 2 + 4, 4, C.silver, PW) + path('M' + N(x0 + 15) + ',' + N(-hw) + ' l0,' + N(hw * 2) + ' M' + N(x0 + 31) + ',' + N(-hw) + ' l0,' + N(hw * 2), 'none', 3.4);
    s += rect(x0 + 44, -hw, bodyL - 44, hw * 2, 3, C.mustard, PW) + path('M' + N(x0 + 50) + ',' + N(-hw / 3) + ' L' + N(x0 + bodyL - 4) + ',' + N(-hw / 3) + ' M' + N(x0 + 50) + ',' + N(hw / 3) + ' L' + N(x0 + bodyL - 4) + ',' + N(hw / 3), 'none', 3);
    var bx = x0 + bodyL, tip = bx + tipL;
    if (sh < 0.3) s += path('M' + N(bx) + ',' + N(-hw) + ' L' + N(tip - 12) + ',-12 Q' + N(tip) + ',0 ' + N(tip - 12) + ',12 L' + N(bx) + ',' + N(hw) + ' Z', C.tan, PW) + path('M' + N(tip - 22) + ',-12 Q' + N(tip) + ',0 ' + N(tip - 22) + ',12 Z', C.ink, 0);
    else s += path('M' + N(bx) + ',' + N(-hw) + ' Q' + N(bx + tipL * 0.3) + ',' + N(-hw * 0.4) + ' ' + N(tip) + ',0 Q' + N(bx + tipL * 0.3) + ',' + N(hw * 0.4) + ' ' + N(bx) + ',' + N(hw) + ' Z', C.tan, PW) + path('M' + N(tip - tipL * 0.34) + ',' + N(-hw * 0.18) + ' L' + N(tip) + ',0 L' + N(tip - tipL * 0.34) + ',' + N(hw * 0.18) + ' Z', C.ink, 4);
    if (o.label !== false) s += unflip(K.text(typeof o.label === 'string' ? o.label : 'THE COUNT', x0 + 44 + (bodyL - 44) / 2, 15, { size: 42, font: 'label' }), o.mirrorText, x0 + 44 + (bodyL - 44) / 2, 0);
    if (o.ting) s += K.sparkle({ x: tip + 40, y: -40, r: 40 });
    return place(o, s);
  };
  /* The sharpener's crank: hub, handle length and the knob (it sits 20 px right of the
     handle's end). K.SHARP.knob(crank) is local; K.sharpenerKnob(o) is in the parent space
     for the same {x, y, scale, flip, rot, crank} you pass to K.sharpener. */
  K.SHARP = { hub: [110, 0], arm: 80, knob: function (crank) { var a = rot([0, -80], (crank || 0) * 360); return [110 + a[0] + 20, a[1]]; } };
  K.sharpenerKnob = function (o) { o = o || {}; return toParent(o, K.SHARP.knob(o.crank)); };
  K.sharpener = function (o) {
    o = o || {};
    var ca = (o.crank || 0) * 360, s = '';
    s += rect(-110, -84, 220, 168, 20, C.mustard, PW) + circ(-60, 0, 38, C.ink, 5) + circ(-60, 0, 24, C.brown, 4) + rect(-104, 50, 208, 26, 8, C.brick, 5);
    s += path('M-30,-60 L80,-60', 'none', 4) + rect(-20, -104, 40, 24, 6, C.silver, 5);
    var arm = rot([0, -80], ca);
    s += circ(110, 0, 16, C.brown, PW) + tube('M110,0 L' + P(110 + arm[0], arm[1]), 14, C.brown, 5) + circ(110 + arm[0] + 20, arm[1], 18, C.brick, 5.5);
    return place(o, s);
  };

  /* --- s02 / s15 things --- */
  /* The snapshot Kit takes in s02 bar 3.75: the Striper set down on the planks, standing
     upright in the 'photo' pose with the stiff grin and facing LEFT (head and shoulders): Kit
     shoots from screen-left, so the picture is mirrored about the eye to show what her camera
     saw, and the photo she holds up in s15 matches. The photo has no lettering. */
  K.photo = function (o) {
    o = o || {};
    var s = rect(-62, -74, 124, 148, 6, C.white, 6);
    var pts = K.striperPoints({ pose: 'photo' }), e = pts.eye;
    var vb = N(e[0] - 150) + ' ' + N(e[1] - 110) + ' 300 300';
    s += '<svg x="-50" y="-62" width="100" height="100" viewBox="' + vb + '" overflow="hidden"><rect x="' + N(e[0] - 150) + '" y="' + N(e[1] - 110) + '" width="300" height="300" fill="' + C.sky + '"/>' +
      '<g transform="translate(' + N(2 * e[0]) + ' 0) scale(-1 1)">' + K.striper({ pose: 'photo', expr: 'grin', suitcase: false }) + '</g></svg>';
    s += rect(-50, -62, 100, 100, 2, 'none', 4);
    if (o.caption !== false) s += path('M-36,56 q10,-6 20,0 t20,0 t20,0', 'none', 3, '', C.gray);
    return place(o, s);
  };
  /* The inked imprint: both border rules and the lettering are in the stamp color (never ink).
     A given w fixes the box width and shrinks the lettering to fit inside it. */
  K.stampMark = function (o) {
    o = o || {};
    var lbl = o.label || 'RECOUNTED', size = o.size || 40, w = o.w || lbl.length * size * 0.62 + 40, h = size * 1.6, col = o.color || C.orange;
    var ts = o.w ? Math.min(size, (w - 40) / (lbl.length * 0.62)) : size;
    var box = function (x, y, bw, bh, r, sw, extra) { return '<rect x="' + N(x) + '" y="' + N(y) + '" width="' + N(bw) + '" height="' + N(bh) + '" rx="' + N(r) + '"' + paint('none', sw, col, extra) + '/>'; };
    var s = box(-w / 2, -h / 2, w, h, 8, 6, ' stroke-dasharray="40 5 18 4"') + box(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 4, 2.5) +
      K.text(lbl, 0, ts * 0.36, { size: N(ts), font: 'label', fill: col });
    return place({ x: o.x, y: o.y, scale: o.scale, rot: o.rot == null ? -8 : o.rot }, s);
  };
  K.ledger = function (o) {
    o = o || {};
    var w = o.w || 190, h = o.h || 230, s = rect(-w / 2, -h / 2, w, h, 6, C.paper, PW);
    var d = ''; for (var i = 0; i < 7; i++) { var y = -h / 2 + 34 + i * 26; d += 'M' + N(-w / 2 + 18) + ',' + N(y) + ' q14,-5 28,0 t28,0 t20,0 '; }
    s += path(d, 'none', 3.2) + path('M' + N(w / 2 - 50) + ',' + N(-h / 2 + 12) + ' L' + N(w / 2 - 50) + ',' + N(h / 2 - 12), 'none', 3, '', C.brick);
    for (var j = 0; j < 7; j++) s += g(fishIcon(0.3), 'translate(' + N(w / 2 - 25) + ' ' + N(-h / 2 + 30 + j * 27) + ')');
    (o.stamps || []).forEach(function (st, k) {
      var lb = typeof st === 'string' ? st : st.label, col = st.color || (lb === 'COUNTED' ? C.gray : C.orange);
      // each imprint is sized to the page (page width minus 24) so it sits fully on the paper
      s += K.stampMark({ label: lb, color: col, size: k ? 30 : 28, w: w - 24, x: 0, y: -20 + k * 50, rot: k ? -10 : 6 });
    });
    return place(o, s);
  };
  K.stamp = function (o) {
    o = o || {};
    var col = o.color || C.orange, s = '';
    s += circ(0, -196, 26, C.brown, PW) + rect(-11, -176, 22, 44, 4, C.brown, PW);
    s += rect(-86, -136, 172, 88, 10, C.tan, PW) + path('M-86,-112 L86,-112', 'none', 4);
    s += rect(-70, -100, 140, 40, 6, C.cream, 4.5) + K.text(o.label || 'RECOUNT', 0, -72, { size: Math.min(30, 230 / (o.label || 'RECOUNT').length), font: 'label', fill: col });
    s += rect(-92, -48, 184, 38, 8, col, PW) + path('M-80,-14 L80,-14', 'none', 3);
    var sq = o.squash || 0;
    return place(o, sq ? g(s, 'scale(' + N((1 + sq) * 1000) / 1000 + ' ' + N((1 - sq) * 1000) / 1000 + ')') : s);
  };

  /* --- s03 survey props --- */
  K.mailbox = function (o) {
    o = o || {};
    var s = rect(-14, -170, 28, 170, 3, C.brown, PW);
    var fl = clamp(o.flag || 0, 0, 1), fa = lerp(0, -90, fl);
    s += path('M-110,-160 L100,-160 L100,-236 Q100,-290 50,-290 L-60,-290 Q-110,-290 -110,-236 Z', C.sea, PW);
    s += path('M-96,-252 Q-60,-278 20,-278', 'none', 4, '', C.skyDeep);
    if (o.door) s += g(path('M0,0 L0,0 L0,130 Q0,150 -10,150 L-10,0 Z', C.sea, PW), 'translate(100 -160) rotate(' + N(-80 * clamp(o.door, 0, 1)) + ')');
    s += path('M100,-160 L100,-236 Q100,-290 50,-290', 'none', 10);
    s += g(rect(-4, -6, 76, 12, 5, C.ink, 0) + rect(52, -30, 52, 36, 4, C.brick, 5), 'translate(-60 -206) rotate(' + N(fa) + ')');
    s += circ(-60, -206, 7, C.ink, 0);
    return place(o, s);
  };
  K.envelope = function (o) {
    o = o || {};
    var op = clamp(o.open || 0, 0, 1), s = '';
    if (op > 0) s += path('M-110,-66 L0,' + N(-66 - 90 * op) + ' L110,-66 Z', C.paper, PW);
    s += rect(-110, -66, 220, 132, 8, C.cream, PW) + path('M-110,62 L-20,-6 M110,62 L20,-6', 'none', 4.5);
    if (op <= 0) s += path('M-108,-64 L0,16 L108,-64', 'none', 4.5);
    s += rect(60, -52, 36, 42, 3, C.sky, 4) + circ(78, -34, 8, C.mustard, 3);
    s += path('M-60,24 h70 M-60,40 h52', 'none', 3.4);
    return place(o, s);
  };
  K.form = function (o) {
    o = o || {};
    var w = o.w || 360, h = o.h || 440, s = '';
    s += rect(-w / 2, 0, w, h, 8, C.paper, PW);
    if (o.border === 'old') s += rect(-w / 2 - 12, -12, w + 24, h + 24, 12, 'none', 7, ' stroke-dasharray="18 12"', C.gray);
    if (o.border === 'new') s += rect(-w / 2 - 12, -12, w + 24, h + 24, 12, 'none', 10, '', C.sea);
    var y = 20;
    if (o.title) { var rows = wrapLines(o.title, Math.floor(w / 17)); rows.forEach(function (r, i) { s += K.text(r, 0, y + 34 + i * 36, { size: 32, font: 'hand' }); }); y += rows.length * 36 + 24; }
    var d = '', bx = '';
    for (var i = 0; i < (o.lines || 4); i++) { var yy = y + 28 + i * 42; bx += rect(-w / 2 + 24, yy - 18, 24, 24, 3, C.white, 3.5); d += 'M' + N(-w / 2 + 64) + ',' + N(yy) + ' q20,-6 40,0 t40,0 t40,0 '; }
    s += bx + path(d, 'none', 3.2);
    var tally = o.tally || 0;
    if (tally) {
      var ty = h - 70, tx = -w / 2 + 40, tl = '';
      for (var t = 0; t < tally; t++) { var gi = Math.floor(t / 5), k = t % 5, x = tx + gi * 80 + k * 13; if (k < 4) tl += 'M' + N(x) + ',' + N(ty) + ' l0,44 '; else tl += 'M' + N(x - 56) + ',' + N(ty + 34) + ' L' + N(x + 4) + ',' + N(ty + 8) + ' '; }
      s += path(tl, 'none', 5);
    }
    return place(o, s);
  };
  K.clipboard = function (o) {
    o = o || {};
    var w = o.w || 170, h = o.h || 220, s = '';
    s += rect(-w / 2, -h / 2, w, h, 10, C.brown, PW) + rect(-w / 2 + 14, -h / 2 + 24, w - 28, h - 38, 3, C.cream, 4.5);
    var d = ''; for (var i = 0; i < (o.lines == null ? 5 : o.lines); i++) { var y = -h / 2 + 62 + i * 28; d += 'M' + N(-w / 2 + 30) + ',' + N(y) + ' q12,-6 24,0 t24,0 t24,0 t20,0 '; }
    s += path(d, 'none', 3.2);
    s += rect(-34, -h / 2 - 12, 68, 34, 8, C.mustard, PW) + circ(0, -h / 2 - 2, 6, C.ink, 0);
    for (var f = 0; f < (o.fish || 0); f++) s += g(fishIcon(0.5), 'translate(' + N(-40 + f * 40) + ' ' + N(h / 2 - 30 - (f % 2) * 20) + ') rotate(' + (f % 2 ? 8 : -6) + ')');
    return place(o, s);
  };
  K.tallyCounter = function (o) {
    o = o || {};
    var s = circ(0, 0, 30, C.silver, 5.5) + rect(-20, -12, 40, 22, 4, C.white, 4) + K.text(o.count || '0004', 0, 5, { size: 16, font: 'cc' }) + rect(-8, -46, 16, 16, 3, C.brick, 4.5) + path('M24,18 q18,10 10,26', 'none', 5);
    return place(o, s);
  };
  /* The label is lettered on the FRONT of the cooler (a cream plate), so it stays level and
     readable when the lid pops open. */
  K.cooler = function (o) {
    o = o || {};
    var op = clamp(o.open || 0, 0, 1), s = '';
    s += rect(-130, -160, 260, 160, 18, C.brick, PW) + path('M-120,-26 L120,-26', 'none', 4) + rect(-150, -118, 26, 40, 8, C.cream, 5) + rect(124, -118, 26, 40, 8, C.cream, 5);
    if (o.label) s += rect(-108, -128, 216, 92, 10, C.cream, 5) + multiText(o.label, 0, -82, 30, 12, { font: 'label', fill: C.brick });
    if (o.spring) {
      var sh = 70 + o.spring * 190, d = 'M0,-150';
      for (var i = 1; i <= 8; i++) d += ' L' + (i % 2 ? 26 : -26) + ',' + N(-150 - sh * i / 8);
      s += path(d, 'none', 11, '', INK) + path(d, 'none', 5, '', C.silver);
      s += K.card({ x: 0, y: -150 - sh - 50, w: 120, h: 100, label: o.card || '0', size: 72, font: 'title' });
    }
    var lid = rect(-138, -40, 276, 44, 14, C.cream, PW) + path('M-110,-18 L110,-18', 'none', 3.4);
    s += g(lid, 'translate(-130 -164) rotate(' + N(-105 * op) + ') translate(130 0)');
    return place(o, s);
  };
  /* THE MULTIPLIER: mustard box on wheels, two funnels, crank, big x, nameplate, card slot.
     K.MULT gives the funnel mouths and slot in its local space (before scale). */
  K.MULT = { funnelL: [-112, -420], funnelR: [112, -420], slot: [150, -118], crank: [182, -230], arm: 64,
    knob: function (crank) { var a = rot([0, -64], (crank || 0) * 360); return [182 + a[0] + 18, -230 + a[1]]; } };
  /* The Multiplier's crank knob in the parent space, for the same {x, y, scale, flip, rot,
     crank} you pass to K.multiplier: aim the Striper's crank palm here (o.reach). */
  K.multiplierKnob = function (o) { o = o || {}; return toParent(o, K.MULT.knob(o.crank)); };
  /* The standard crank staging for either machine: the Striper faces the machine from its
     crank side (flip: true), at the machine's scale, with the crank hub 208 px in front of
     him and 230 px up on the Multiplier (his tail stands on the machine's ground line) or
     190 px up on the wall sharpener (mount it so its centre is 190 px above his ground).
     frame 0 | 1 | 2 is his drawing and the handle's position (crank = frame / 3, handle at 0,
     120, 240 degrees). Returns {crank, knob, striper}: pass crank to the machine and
     striper (add mouth, blink, expr...) to K.striper; his palm lands on the knob. */
  K.crankStage = function (o) {
    o = o || {};
    var sh = o.machine === 'sharpener', sc = o.scale == null ? 1 : o.scale, f = Math.abs(Math.round(o.frame || 0)) % 3, crank = f / 3;
    var hub = sh ? K.SHARP.hub : K.MULT.crank, mo = { x: o.x || 0, y: o.y || 0, scale: sc, crank: crank };
    var knob = sh ? K.sharpenerKnob(mo) : K.multiplierKnob(mo);
    return { crank: crank, knob: knob, striper: { x: (o.x || 0) + (hub[0] + 208) * sc, y: (o.y || 0) + (hub[1] + (sh ? 190 : 230)) * sc, scale: sc, flip: true, pose: 'crank', frame: f, reach: knob } };
  };
  K.multiplier = function (o) {
    o = o || {};
    var s = '', ca = (o.crank || 0) * 360;
    [-112, 112].forEach(function (x) { s += path('M' + (x - 70) + ',-420 L' + (x + 70) + ',-420 L' + (x + 20) + ',-352 L' + (x + 20) + ',-310 L' + (x - 20) + ',-310 L' + (x - 20) + ',-352 Z', C.cream, PW) + path('M' + (x - 58) + ',-408 L' + (x + 58) + ',-408', 'none', 3.4); });
    s += rect(-190, -330, 380, 250, 26, C.mustard, PW);
    s += path('M-170,-308 L170,-308', 'none', 4);
    s += g(tube('M-44,-44 L44,44 M44,-44 L-44,44', 26, C.cream, 6), 'translate(-24 -168)');
    s += rect(-150, -300, 220, 50, 10, C.cream, 5) + K.text('THE MULTIPLIER', -40, -265, { size: 30, font: 'label' });
    s += rect(96, -128, 108, 20, 6, C.ink, 0);
    var cp = K.MULT.crank, arm = rot([0, -64], ca);
    s += circ(cp[0], cp[1], 16, C.brown, PW) + tube('M' + P(cp) + ' L' + P(add(cp, arm)), 12, C.brown, 5) + circ(cp[0] + arm[0] + 18, cp[1] + arm[1], 15, C.brick, 5.5) + circ(cp[0], cp[1], 7, C.ink, 0);
    [-118, 118].forEach(function (x) {
      s += circ(x, -60, 58, C.brown, PW) + circ(x, -60, 16, C.mustard, 5);
      var sp = ''; for (var i = 0; i < 4; i++) { var a = i * 45 + ca * 0.25; sp += 'M' + P(add([x, -60], rot([18, 0], a))) + ' L' + P(add([x, -60], rot([50, 0], a))) + ' M' + P(add([x, -60], rot([-18, 0], a))) + ' L' + P(add([x, -60], rot([-50, 0], a))) + ' '; }
      s += path(sp, 'none', 5);
    });
    if (o.labels) {
      if (o.labels.left !== false) s += K.tag(o.labels.left || 'TRIPS', -112, -470, { size: 32 });
      if (o.labels.right !== false) s += K.tag(o.labels.right || 'FISH PER TRIP', 112, -470, { size: 32 });
    }
    if (o.card) {
      var cp2 = clamp(o.card, 0, 1), cs = o.cardStyle || 'plain';
      if (o.cardGhost) s += K.card({ x: 150 + 200, y: -40, w: 300, h: 150, style: 'ghost' });
      s += K.card({ x: 150 + lerp(0, 200, cp2), y: lerp(-118, -40, cp2), w: o.cardGhost ? 240 : 300, h: o.cardGhost ? 116 : 150, label: o.cardLabel || "ANGLERS' TOTAL CATCH", size: o.cardGhost ? 32 : 40, style: cs, scale: lerp(0.3, 1, cp2) });
    }
    return place(o, s);
  };

  /* --- calendar, chalkboard, stacks, arrows --- */
  K.calendar = function (o) {
    o = o || {};
    var w = o.w || 340, h = o.h || 330, s = '';
    if (o.string) s += path('M0,' + N(-o.string) + ' L0,0', 'none', 4);
    if (o.border === 'old') s += rect(-w / 2 - 14, -2, w + 28, h + 16, 14, 'none', 7, ' stroke-dasharray="18 12"', C.gray);
    if (o.border === 'new') s += rect(-w / 2 - 12, -2, w + 24, h + 14, 14, 'none', 11, '', C.sea);
    s += rect(-w / 2, 8, w, h - 8, 8, C.paper, PW);
    var hh = Math.min(86, h * 0.26);
    s += rect(-w / 2, 8, w, hh, 8, C.brick, PW);
    if (o.label) s += K.text(o.label, 0, 8 + hh / 2 + Math.min(50, hh * 0.58) * 0.36, { size: Math.min(56, hh * 0.62, (w - 30) / (o.label.length * 0.56)), font: 'label', fill: C.cream });
    var cols = 7, rows = o.rows || 5, gx = (w - 30) / cols, gy = (h - hh - 34) / rows, d = '';
    for (var i = 0; i <= cols; i++) d += 'M' + N(-w / 2 + 15 + i * gx) + ',' + N(8 + hh + 14) + ' L' + N(-w / 2 + 15 + i * gx) + ',' + N(8 + hh + 14 + rows * gy) + ' ';
    for (var j = 0; j <= rows; j++) d += 'M' + N(-w / 2 + 15) + ',' + N(8 + hh + 14 + j * gy) + ' L' + N(w / 2 - 15) + ',' + N(8 + hh + 14 + j * gy) + ' ';
    s += path(d, 'none', 2.6);
    s += circ(-w / 4, 8, 10, C.silver, 4.5) + circ(w / 4, 8, 10, C.silver, 4.5);
    (o.stickers || []).forEach(function (st) { s += K.tripToken({ x: st[0], y: st[1], r: st[2] || 22, stray: st[3] === 'stray', ghost: st[3] === 'ghost' }); });
    return place(o, s);
  };
  K.calendarTabs = function (o) {
    o = o || {};
    var tabs = o.tabs || ['JAN-FEB', 'MAR-APR', 'MAY-JUN', 'JUL-AUG', 'SEP-OCT', 'NOV-DEC'], w = o.w || 1100, tw = w / tabs.length, s = '';
    tabs.forEach(function (t, i) {
      var x = -w / 2 + i * tw, act = t === o.active;
      s += path('M' + N(x + 6) + ',0 L' + N(x + 14) + ',-58 Q' + N(x + 16) + ',-66 ' + N(x + 26) + ',-66 L' + N(x + tw - 26) + ',-66 Q' + N(x + tw - 16) + ',-66 ' + N(x + tw - 14) + ',-58 L' + N(x + tw - 6) + ',0 Z', act ? C.mustard : C.paper, 6);
      s += K.text(t, x + tw / 2, -20, { size: Math.min(34, tw / 5), font: 'label' });
    });
    return place(o, s);
  };
  K.chalkboard = function (o) {
    o = o || {};
    var w = o.w || 640, h = o.h || 420, lh = o.easel === false ? 0 : (o.legH == null ? 180 : o.legH), s = '';
    if (lh) s += path('M' + N(-w * 0.32) + ',0 L' + N(-w * 0.2) + ',' + N(-lh - h) + ' M' + N(w * 0.32) + ',0 L' + N(w * 0.2) + ',' + N(-lh - h) + ' M0,' + N(-lh - h) + ' L0,' + N(-lh * 0.2), 'none', 24, '', INK) +
      path('M' + N(-w * 0.32) + ',0 L' + N(-w * 0.2) + ',' + N(-lh - h) + ' M' + N(w * 0.32) + ',0 L' + N(w * 0.2) + ',' + N(-lh - h) + ' M0,' + N(-lh - h) + ' L0,' + N(-lh * 0.2), 'none', 12, '', C.brown);
    s += rect(-w / 2 - 18, -lh - h - 18, w + 36, h + 36, 12, C.brown, PW) + rect(-w / 2, -lh - h, w, h, 6, C.olive, 5);
    s += rect(-w / 2 - 10, -lh + 12, w + 20, 16, 4, C.brown, 5) + rect(-w / 2 + 40, -lh + 2, 40, 12, 3, C.white, 3);
    s += path('M' + N(-w / 2 + 40) + ',' + N(-lh - h + 60) + ' q30,-10 60,4 M' + N(w / 2 - 110) + ',' + N(-lh - 40) + ' q30,8 60,-6', 'none', 3, ' opacity=".5"', C.cream);
    if (o.title) s += K.text(o.title, 0, -lh - h + 64, { size: o.titleSize || 52, font: 'hand', fill: C.cream });
    return place(o, s);
  };
  /* A framed panel on a post holding a stack of plain blocks. The top `ghosts` blocks are gray
     dashed ghost blocks (they never fall off). shade 0..1 pulls a cream roller shade down over it. */
  K.stack = function (o) {
    o = o || {};
    var n = o.n || 8, gh = clamp(o.ghosts || 0, 0, n), bw = o.bw || 110, bh = o.bh || 34, col = o.color || C.brick, ph = o.postH == null ? 150 : o.postH;
    var pw = bw + 70, pht = n * bh + 60 + (o.headroom || 0), s = '';
    if (ph) s += rect(-12, -ph - 10, 24, ph + 10, 3, C.brown, PW);
    var top = -ph - pht;
    s += rect(-pw / 2 - 16, top - 16, pw + 32, pht + 32, 10, C.brown, PW) + rect(-pw / 2, top, pw, pht, 4, C.cream, 4.5);
    for (var i = 0; i < n; i++) {
      var y = -ph - 22 - (i + 1) * bh, ghost = i >= n - gh;
      if (ghost) s += rect(-bw / 2, y, bw, bh - 4, 5, 'none', 5, ' stroke-dasharray="10 7"').replace('stroke="' + INK + '"', 'stroke="' + C.gray + '"');
      else s += rect(-bw / 2, y, bw, bh - 4, 5, col, 5.5);
    }
    s += rect(-pw / 2 + 6, -ph - 22, pw - 12, 6, 2, C.brown, 0);
    var sh = clamp(o.shade || 0, 0, 1);
    if (sh > 0) {
      var sy = top + pht * sh;
      s += rect(-pw / 2 - 8, top - 8, pw + 16, sy - top + 8, 4, C.cream, 5) + rect(-pw / 2 - 10, sy - 10, pw + 20, 16, 6, C.brown, 5) + path('M0,' + N(sy + 6) + ' l0,22', 'none', 3) + circ(0, sy + 36, 9, 'none', 4);
    }
    s += rect(-pw / 2 - 28, top - 26, pw + 56, 22, 8, C.brown, 5);
    if (o.tag) s += K.tag(o.tag, 0, top - 70, { size: o.tagSize || 32 });
    return place(o, s);
  };
  K.arrow = function (o) {
    o = o || {};
    var l = o.len || 220, w = o.w || 56, col = o.color || C.brick, hl = Math.min(l * 0.45, w * 1.3);
    if (o.dashed) return place(o, path('M0,0 L' + N(l - hl * 0.5) + ',0', 'none', 7, ' stroke-dasharray="18 12"', col) + path('M' + N(l - hl * 0.7) + ',' + N(-hl * 0.45) + ' L' + N(l) + ',0 L' + N(l - hl * 0.7) + ',' + N(hl * 0.45), 'none', 8, '', col));
    return place(o, path('M0,' + N(-w * 0.28) + ' L' + N(l - hl) + ',' + N(-w * 0.28) + ' L' + N(l - hl) + ',' + N(-w * 0.62) + ' L' + N(l) + ',0 L' + N(l - hl) + ',' + N(w * 0.62) + ' L' + N(l - hl) + ',' + N(w * 0.28) + ' L0,' + N(w * 0.28) + ' Z', col, PW));
  };

  /* --- the school pie (s09) --- */
  K.pie = function (o) {
    o = o || {};
    var r = o.r || 260, k = 0.52, dep = 46, cs = o.crust == null ? 1 : o.crust, si = o.sliceAt == null ? 1 : o.sliceAt, s = '';
    if (o.covered) {
      // s08: the same brown tin under a silver dome cover with a knob (nothing inside shows)
      s += path('M' + P(-r - 18, 0) + ' L' + P(-r + 6, dep + 12) + ' A' + N(r - 6) + ' ' + N((r - 6) * k) + ' 0 0 0 ' + P(r - 6, dep + 12) + ' L' + P(r + 18, 0) + ' Z', C.brown, PW);
      s += ell(0, 0, r + 18, (r + 18) * k, C.brown, PW);
      s += path('M' + P(-r - 4, 4) + ' C' + P(-r - 4, -r * 1.02) + ' ' + P(r + 4, -r * 1.02) + ' ' + P(r + 4, 4) + ' Q' + P(0, (r + 4) * k * 0.9) + ' ' + P(-r - 4, 4) + ' Z', C.silver, PW);
      s += path('M' + P(-r * 0.62, -r * 0.42) + ' Q' + P(-r * 0.4, -r * 0.66) + ' ' + P(-r * 0.08, -r * 0.72), 'none', 8, '', C.white);
      s += rect(-26, -r * 0.84, 52, 22, 8, C.brown, PW) + circ(0, -r * 0.86, 20, C.brown, PW);
      return place(o, s);
    }
    var a0 = -90 + si * 72 - 36 + 36, lift = o.lift || 0;
    function E(a, rr, dy) { return [Math.cos(a * rad) * rr, Math.sin(a * rad) * rr * k + (dy || 0)]; }
    function wedge(A, B, rr, dy) { var p = E(A, rr, dy), q = E(B, rr, dy); return 'M' + P(0, dy || 0) + ' L' + P(p) + ' A' + N(rr) + ' ' + N(rr * k) + ' 0 0 1 ' + P(q) + ' Z'; }
    if (o.ghostRim) s += ell(0, dep * 0.5, r + 22, (r + 22) * k + dep * 0.5, 'none', 7, 0, ' stroke-dasharray="18 12"').replace('stroke="' + INK + '"', 'stroke="' + C.gray + '"');
    var pie = '';
    pie += path('M' + P(-r - 18, 0) + ' L' + P(-r + 6, dep + 12) + ' A' + N(r - 6) + ' ' + N((r - 6) * k) + ' 0 0 0 ' + P(r - 6, dep + 12) + ' L' + P(r + 18, 0) + ' Z', C.brown, PW);
    pie += ell(0, 0, r + 18, (r + 18) * k, C.brown, PW);
    pie += ell(0, 0, r, r * k, C.sand, 5);
    var fishPts = [[-120, -40], [20, -80], [140, -30], [-60, 40], [80, 50], [-170, 20], [180, 30], [-20, 0], [60, -30], [-110, 80]];
    fishPts.forEach(function (p, i) { if (Math.abs(p[0] / r) + Math.abs(p[1] / (r * k)) < 1.05) pie += g(fishIcon(0.42), 'translate(' + P(p[0] * r / 260, p[1] * r / 260) + ') rotate(' + (i % 2 ? 8 : -6) + ')'); });
    var d = ''; for (var i = 0; i < 5; i++) { var q = E(-90 + i * 72 + 36 - 36 + 36, r); d += 'M0,0 L' + P(q) + ' '; }
    pie += path(d, 'none', 4.5, ' stroke-dasharray="3 12"');
    var A = -54 + si * 72, B = A + 72;
    if (lift > 0) pie += path(wedge(A, B, r - 2), C.orange, 4.5) + path('M0,0 L' + P(E(A, r - 2)) + ' M0,0 L' + P(E(B, r - 2)), 'none', 5, '', C.brick);
    s += cs !== 1 ? g(pie, 'scale(' + N(cs * 1000) / 1000 + ')') : pie;
    if (lift > 0) {
      var up = -lift * (o.liftH || 190), mid = E((A + B) / 2, r * 0.45), ss = o.slice == null ? 1 : o.slice;
      var sl = function (fillTop) {
        var p1 = E(A, r), p2 = E(B, r);
        return path('M' + P(0, 0) + ' L' + P(p1) + ' L' + P(p1[0], p1[1] + 40) + ' L' + P(0, 40) + ' Z', C.orange, 5) +
          path('M' + P(p1) + ' A' + N(r) + ' ' + N(r * k) + ' 0 0 1 ' + P(p2) + ' L' + P(p2[0], p2[1] + 40) + ' A' + N(r) + ' ' + N(r * k) + ' 0 0 0 ' + P(p1[0], p1[1] + 40) + ' Z', C.orange, 5) +
          path(wedge(A, B, r), fillTop, 5);
      };
      var ghostD = wedge(A, B, r);
      var tr = 'translate(' + P(mid[0] * 0.3, up) + ')';
      if (o.ghostSlice || ss < 1) s += g(path(ghostD, 'none', 6, ' stroke-dasharray="14 10"', C.gray) + path('M' + P(E(A, r)) + ' l0,40 M' + P(E(B, r)) + ' l0,40', 'none', 6, ' stroke-dasharray="10 8"', C.gray), tr);
      s += g(g(sl(C.sand) + g(fishIcon(0.42), 'translate(' + P(mid) + ')'), 'translate(' + P(mid) + ') scale(' + N(ss * 1000) / 1000 + ') translate(' + P(-mid[0], -mid[1]) + ')'), tr);
    }
    return place(o, s);
  };
  /* The table's top plane is foreshortened like the pie (k = 0.52): K.TABLE_K. */
  K.TABLE_K = 0.52;
  K.picnicTable = function (o) {
    o = o || {};
    var w = o.w || 1400, h = o.h || 230, s = '';
    if (o.top) return place(o, tableTop(o, w, h));
    s += rect(-w / 2 + 80, 40, 40, h + 60, 4, C.brown, PW) + rect(w / 2 - 120, 40, 40, h + 60, 4, C.brown, PW);
    s += rect(-w / 2, -24, w, 40, 8, C.tan, PW);
    var cw = 70, cols = Math.ceil(w / cw), rows = Math.ceil(h / cw);
    var cl = rect(-w / 2 - 10, 0, w + 20, h, 0, C.cream, 0);
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) if ((r + c) % 2 === 0) cl += rect(-w / 2 - 10 + c * cw, r * cw, Math.min(cw, w / 2 + 10 - (-w / 2 - 10 + c * cw)), Math.min(cw, h - r * cw), 0, C.brick, 0);
    s += cl + path('M' + N(-w / 2 - 10) + ',0 L' + N(-w / 2 - 10) + ',' + h + ' L' + N(w / 2 + 10) + ',' + h + ' L' + N(w / 2 + 10) + ',0', 'none', PW);
    s += rect(-w / 2 - 20, -18, w + 40, 26, 8, C.cream, PW);
    return place(o, s);
  };
  /* The picnic table with its top plane (o.top = the plane's depth on screen in px): a
     checkered cloth tabletop from y = -top (back edge) to 0 (front fold), its checks
     foreshortened at K.TABLE_K and the back edge narrowed by taper (default 0.12) so it reads as
     a flat surface you can stab a fork into; the cloth folds over the front edge and hangs h px;
     the legs run legH px below the hem (default 50). */
  function tableTop(o, w, h) {
    var top = o.top, tp = o.taper == null ? 0.12 : o.taper, cols = Math.max(2, Math.round(w / 70)), cw = w / cols;
    var rh = cw * K.TABLE_K, rows = Math.max(1, Math.round(top / rh)), s = '', lh = o.legH == null ? 50 : o.legH;
    rh = top / rows;
    function X(xf, y) { return xf * lerp(1 - tp, 1, (y + top) / top); }
    s += rect(-w / 2 + 50, h - 20, 34, lh + 20, 4, C.brown, PW) + rect(w / 2 - 84, h - 20, 34, lh + 20, 4, C.brown, PW);
    // the top plane: cream ground, then brick checks (front row alternates with the drop's top row)
    s += path('M' + P(X(-w / 2, -top), -top) + ' L' + P(X(w / 2, -top), -top) + ' L' + P(w / 2, 0) + ' L' + P(-w / 2, 0) + ' Z', C.cream, 0);
    var d = '';
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      if ((rows - 1 - r + c) % 2 !== 1) continue;
      var y0 = -top + r * rh, y1 = y0 + rh, xa = -w / 2 + c * cw, xb = xa + cw;
      d += 'M' + P(X(xa, y0), y0) + ' L' + P(X(xb, y0), y0) + ' L' + P(X(xb, y1), y1) + ' L' + P(X(xa, y1), y1) + ' Z ';
    }
    s += path(d, C.brick, 0);
    s += path('M' + P(X(-w / 2, -top), -top) + ' L' + P(X(w / 2, -top), -top) + ' L' + P(w / 2, 0) + ' L' + P(-w / 2, 0) + ' Z', 'none', PW);
    // the drop: square checks hanging from the front fold
    var dr = Math.max(1, Math.round(h / cw)), dh = h / dr, dd = '';
    s += rect(-w / 2, 0, w, h, 0, C.cream, 0);
    for (var i = 0; i < dr; i++) for (var j = 0; j < cols; j++) if ((i + j) % 2 === 0) dd += 'M' + P(-w / 2 + j * cw, i * dh) + ' h' + N(cw) + ' v' + N(dh) + ' h' + N(-cw) + ' Z ';
    s += path(dd, C.brick, 0);
    s += path('M' + P(-w / 2, 0) + ' L' + P(-w / 2, h) + ' L' + P(w / 2, h) + ' L' + P(w / 2, 0), 'none', PW);
    s += path('M' + P(-w / 2 - 4, 0) + ' L' + P(w / 2 + 4, 0), 'none', PW + 2);
    return s;
  }
  K.gauge = function (o) {
    o = o || {};
    var r = o.r || 120, v = clamp(o.value == null ? 0.2 : o.value, 0, 1), ph = o.postH == null ? 160 : o.postH, s = '';
    if (ph) s += rect(-12, -ph, 24, ph, 3, C.brown, PW);
    var cy = -ph - r;
    s += circ(0, cy, r + 14, C.brown, PW) + circ(0, cy, r, C.cream, 5);
    var d = ''; for (var i = 0; i <= 10; i++) { var a = -210 + i * 24; d += 'M' + P(add([0, cy], rot([r * 0.8, 0], a))) + ' L' + P(add([0, cy], rot([r * 0.92, 0], a))) + ' '; }
    s += path(d, 'none', 4);
    if (o.label) s += K.text(o.label, 0, cy + r * 0.42, { size: r * 0.2, font: 'label' });
    if (o.text) s += K.text(o.text, 0, cy - r * 0.34, { size: r * 0.26, font: 'label', fill: C.brick });
    var na = -210 + v * 240;
    s += tube('M' + P(0, cy) + ' L' + P(add([0, cy], rot([r * 0.78, 0], na))), 8, C.brick, 4) + circ(0, cy, 13, C.ink, 0);
    return place(o, s);
  };

  /* --- the fish ladder of steps (s13) and the Board table (s13, s14) --- */
  K.poolSign = function (o) {
    o = o || {};
    var w = o.w || 270, h = o.lettered ? (o.h || 170) : 110, ph = o.postH == null ? 90 : o.postH, s = '';
    s += rect(-10, -ph - 10, 20, ph + 10, 3, C.brown, PW);
    s += rect(-w / 2, -ph - h, w, h, 10, C.brown, PW) + rect(-w / 2 + 10, -ph - h + 10, w - 20, h - 20, 6, 'none', 3, '', C.tan);
    if (o.lettered && o.label) {
      s += K.text(String(o.num == null ? '' : o.num), -w / 2 + 32, -ph - h / 2 + 22, { size: 60, font: 'label', fill: C.mustard });
      s += multiText(o.label, 26, -ph - h / 2, o.size || 36, o.chars || Math.floor((w - 70) / 19), { font: 'label', fill: C.cream });
    } else s += K.text(String(o.num == null ? '' : o.num), 0, -ph - h / 2 + 22, { size: 64, font: 'label', fill: C.cream });
    if (o.check) s += g(tube('M-30,2 L-8,26 L34,-28', 14, C.cream, 5), 'translate(' + N(w / 2 - 6) + ' ' + N(-ph - h - 6) + ') scale(0.9)');
    if (o.q) s += K.qmark({ x: w / 2 + 14, y: -ph - h + 20, size: 130 });
    return place(o, s);
  };
  /* Each pool spills into the one below in a clear cascade (a sea sheet over the lip with white
     streaks and foam), so the set reads as a fish ladder, not a staircase. Above the top pool
     calm river water runs on past the sign UPRIVER TO SPAWN (topSign: false hides it). */
  K.ladder = function (o) {
    o = o || {};
    var n = o.n || 6, sw = o.stepW || 280, sh = o.stepH || 110, labels = o.labels || ['SURVEY', 'CORRECTION', 'NEW STOCK ASSESSMENT', 'INDEPENDENT PEER REVIEW', 'STRIPED BASS MANAGEMENT BOARD', 'NEW RULES'];
    var s = '', spills = '', signs = '', ts = o.topSign === undefined ? 'UPRIVER TO SPAWN' : o.topSign;
    var yw = function (i) { return -(i + 1) * sh - 14; };
    // the calm river above the top pool
    var tx = n * sw, ty = yw(n - 1);
    if (ts !== false) {
      s += rect(tx - 20, ty - 4, sw * 0.9, 50, 6, C.sea, 5) + rect(tx - 20, ty + 40, sw * 0.9, -ty - 40, 6, C.brown, PW);
      s += path('M' + N(tx + 20) + ',' + N(ty + 16) + ' q20,-8 40,0 t40,0 M' + N(tx + 110) + ',' + N(ty + 30) + ' q16,-6 32,0 t32,0', 'none', 3.4, '', C.white);
    }
    var front = '';
    for (var i = 0; i < n; i++) {
      var x = i * sw, top = -(i + 1) * sh - 40;
      s += rect(x, top, sw + 14, -top, 8, C.cream, PW);
      // the pool: water band, surface line and the stone lip in front of it (the front layer
      // repeats these over whatever sits in the pool)
      var pool = rect(x + 12, top + 26, sw - 10, 44, 6, C.sea, 5) + path('M' + N(x + 12) + ',' + N(top + 26) + ' L' + N(x + sw + 2) + ',' + N(top + 26), 'none', 4, '', C.white) +
        rect(x + 2, top + 64, sw + 10, 26, 6, C.cream, 5);
      s += pool; front += pool;
      var tex = 'M' + N(x + 40) + ',' + N(top + 120) + ' l30,0 M' + N(x + sw - 80) + ',' + N(top + 150) + ' l24,0 M' + N(x + 90) + ',' + N(top + 180) + ' l20,0';
      if (-top > 200) s += path(tex, 'none', 3.4);
      if (i > 0) {
        // cascade from pool i over its left lip into pool i - 1
        var lx = x + 12, y1 = yw(i), y0 = yw(i - 1) + 6;
        var d = 'M' + N(lx + 30) + ',' + N(y1) + ' Q' + N(lx - 18) + ',' + N(y1 + 4) + ' ' + N(lx - 44) + ',' + N(y0) + ' L' + N(lx + 6) + ',' + N(y0) + ' Q' + N(lx + 4) + ',' + N(y1 + 36) + ' ' + N(lx + 44) + ',' + N(y1) + ' Z';
        spills += path(d, C.sea, 5);
        spills += path('M' + N(lx + 20) + ',' + N(y1 + 6) + ' Q' + N(lx - 10) + ',' + N(y1 + 20) + ' ' + N(lx - 26) + ',' + N(y0 - 8) + ' M' + N(lx + 30) + ',' + N(y1 + 10) + ' Q' + N(lx + 6) + ',' + N(y1 + 36) + ' ' + N(lx - 8) + ',' + N(y0 - 6), 'none', 4, '', C.white);
        spills += K.puff({ x: lx - 22, y: y0 + 2, r: 20, seed: i + 1, fill: C.white }) + K.puff({ x: lx + 6, y: y0 + 4, r: 14, seed: i + 5, fill: C.white });
        spills += g(path('M0,-9 Q7,0 0,6 Q-7,0 0,-9 Z', C.white, 3.4), 'translate(' + N(lx - 52) + ' ' + N(y0 - 18) + ') rotate(-30)') + g(path('M0,-9 Q7,0 0,6 Q-7,0 0,-9 Z', C.white, 3.4), 'translate(' + N(lx + 22) + ' ' + N(y0 - 20) + ') rotate(25)');
      }
      if (o.signs !== false) {
        var lt = o.lettered ? o.lettered[i] : false;
        signs += K.poolSign({ x: x + sw * 0.55, y: top + 2, num: i + 1, label: labels[i], lettered: lt, check: o.checks ? o.checks[i] : false, q: o.q && i === n - 1 && !lt, scale: o.signScale || 0.92, postH: o.signPostH });
      }
    }
    if (ts !== false) signs += K.sign({ x: tx + sw * 0.62, y: ty + 2, label: ts, w: 250, h: 110, size: 36, postH: 110 }) + K.arrow({ x: tx + sw * 0.42, y: ty - 252, len: 130, w: 34, color: C.mustard });
    if (o.layer === 'front') return place(o, front + spills);
    if (o.layer === 'back') return place(o, s + signs);
    return place(o, s + spills + signs);
  };
  K.boardTable = function (o) {
    o = o || {};
    var w = o.w || 760, s = '', nch = o.chairs == null ? 5 : o.chairs;
    for (var i = 0; i < nch; i++) { var x = -w / 2 + 80 + i * (w - 160) / Math.max(1, nch - 1); s += rect(x - 42, -300, 84, 150, 16, C.brown, PW) + rect(x - 26, -282, 52, 40, 8, C.tan, 4); }
    s += rect(-w / 2 + 30, -150, 26, 150, 3, C.brown, PW) + rect(w / 2 - 56, -150, 26, 150, 3, C.brown, PW);
    s += rect(-w / 2, -190, w, 40, 8, C.brown, PW) + rect(-w / 2 + 20, -150, w - 40, 60, 4, C.brown, PW) + path('M' + N(-w / 2 + 40) + ',-126 l' + N(w - 80) + ',0', 'none', 3, '', C.tan);
    if (o.scroll !== false) {
      s += rect(-120, -226, 240, 36, 4, C.cream, 5) + circ(-124, -208, 20, C.cream, 5) + circ(124, -208, 20, C.cream, 5) + circ(-124, -208, 7, 'none', 3) + circ(124, -208, 7, 'none', 3);
      if (o.scrollText) s += K.text(o.scrollText, 0, -200, { size: 26, font: 'hand' });
    }
    if (o.gavel !== false) {
      s += rect(170, -204, 90, 16, 5, C.tan, 5);
      s += g(rect(-60, -8, 110, 14, 6, C.brown, 5) + rect(40, -22, 44, 42, 8, C.brown, 5.5) + path('M50,-22 L50,20 M74,-22 L74,20', 'none', 3, '', C.tan), 'translate(200 -226) rotate(-8)');
    }
    return place(o, s);
  };
  K.stockPot = function (o) {
    o = o || {};
    var s = '', st = o.steam == null ? 1 : o.steam;
    if (st > 0) [[-60, -290], [10, -320], [70, -286]].forEach(function (p, i) { s += K.puff({ x: p[0], y: p[1] - st * 20, r: 30 + i * 4, seed: i + 2, fill: C.white }); });
    s += rect(-210, -170, 36, 26, 10, C.brown, PW) + rect(174, -170, 36, 26, 10, C.brown, PW);
    s += path('M-180,-230 L180,-230 L166,-14 Q164,0 150,0 L-150,0 Q-164,0 -166,-14 Z', C.brown, PW);
    s += rect(-196, -250, 392, 30, 12, C.brown, PW) + path('M-160,-100 L160,-100', 'none', 4, '', C.tan);
    return place(o, s);
  };

  /* --- the title tackle box and the TACKLE BOX ROCK! logo --- */
  K.tackleBox = function (o) {
    o = o || {};
    var op = clamp(o.open || 0, 0, 1), tr = clamp(o.trays == null ? op : o.trays, 0, 1), s = '';
    var W = 360, H = 190, lidH = 76;
    function handle(y) { return path('M-60,' + N(y) + ' C-60,' + N(y - 60) + ' 60,' + N(y - 60) + ' 60,' + N(y), 'none', 24, '', INK) + path('M-60,' + N(y) + ' C-60,' + N(y - 60) + ' 60,' + N(y - 60) + ' 60,' + N(y), 'none', 12, '', C.brown); }
    if (op > 0) {
      // lid flipped back: its inside face shows above the box, tilting back in two drawings
      var lh = op < 0.5 ? lidH * 0.6 : lidH * 1.6, sk = op < 0.5 ? 10 : 24;
      s += path('M' + N(-W / 2 + 8) + ',' + N(-H + 30) + ' L' + N(-W / 2 + 8 - sk) + ',' + N(-H + 30 - lh) + ' L' + N(W / 2 - 8 - sk) + ',' + N(-H + 30 - lh) + ' L' + N(W / 2 - 8) + ',' + N(-H + 30) + ' Z', C.mustard, PW);
      s += path('M' + N(-W / 2 + 26) + ',' + N(-H + 22) + ' L' + N(-W / 2 + 26 - sk * 0.8) + ',' + N(-H + 40 - lh) + ' L' + N(W / 2 - 26 - sk * 0.8) + ',' + N(-H + 40 - lh) + ' L' + N(W / 2 - 26) + ',' + N(-H + 22) + ' Z', C.sand, 4);
    }
    s += rect(-W / 2, -H + 20, W, H - 20, 22, C.mustard, PW);
    for (var i = 2; i >= 0; i--) {
      var dx = tr * (i + 1) * 96, dy = -tr * (i + 1) * 74, tw = W - 70;
      var ty = -H + 36 + dy, tx = -W / 2 + 35 + dx;
      if (tr > 0) s += path('M' + N(tx + 30) + ',' + N(ty + 50) + ' L' + N(tx + 30 - 96) + ',' + N(ty + 50 + 74) + ' M' + N(tx + tw - 30) + ',' + N(ty + 50) + ' L' + N(tx + tw - 30 - 96) + ',' + N(ty + 50 + 74), 'none', 9, '', C.brown);
      s += rect(tx, ty, tw, 56, 8, C.orange, PW);
      var d = ''; for (var c = 1; c < 5; c++) d += 'M' + N(tx + c * tw / 5) + ',' + N(ty + 6) + ' L' + N(tx + c * tw / 5) + ',' + N(ty + 52) + ' ';
      s += path(d, 'none', 4);
      [C.brick, C.sky, C.mustard, C.avocado, C.cream].forEach(function (cc, k) { s += circ(tx + (k + 0.5) * tw / 5, ty + 30, 9, cc, 3.5); });
    }
    s += rect(-W / 2, -H * 0.62, W, H * 0.62, 20, C.mustard, PW) + path('M' + N(-W / 2 + 20) + ',' + N(-H * 0.3) + ' L' + N(W / 2 - 20) + ',' + N(-H * 0.3), 'none', 4, ' stroke-dasharray="3 14"');
    if (op <= 0) s += rect(-W / 2, -H, W, lidH, 20, C.mustard, PW) + handle(-H);
    s += circ(0, -H * 0.62 + 2, 18, C.sand, 5.5) + circ(0, -H * 0.62 + 2, 6, C.ink, 0);
    return place(o, s);
  };
  K.logo = function (o) {
    o = o || {};
    var s = '', n = 18, pts = [];
    if (o.spring) {
      var sl = o.spring, d = 'M0,' + N(200 + sl);
      for (var j = 1; j <= 10; j++) d += ' L' + (j % 2 ? 40 : -40) + ',' + N(200 + sl - sl * j / 10);
      s += path(d, 'none', 16, '', INK) + path(d, 'none', 7, '', C.silver);
    }
    for (var i = 0; i < n * 2; i++) { var a = i / (n * 2) * Math.PI * 2 + (o.spin || 0), rr = i % 2 ? 236 : 290; pts.push([Math.cos(a) * rr, Math.sin(a) * rr * 0.78]); }
    s += path(smooth(pts, true, 0.55), C.magenta, LW);
    s += ell(0, 0, 222, 174, C.mustard, LW) + ell(0, 0, 196, 150, C.orange, 5);
    s += g(K.text('TACKLE BOX', 0, -30, { size: 70, font: 'title', fill: C.cream, stroke: INK, strokeW: 10 }) + K.text('ROCK!', 0, 88, { size: 124, font: 'title', fill: C.cream, stroke: INK, strokeW: 14 }), 'rotate(-3)');
    return place(o, s);
  };

  /* --- the dock and the coast --- */
  K.piling = function (o) {
    o = o || {};
    var h = o.h || 260, r = o.r || 34, s = '';
    s += rect(-r, -h, r * 2, h, 6, C.brown, PW) + ell(0, -h, r, r * 0.34, C.tan, PW) + ell(0, -h, r * 0.45, r * 0.14, 'none', 3);
    s += path('M' + N(-r * 0.4) + ',' + N(-h * 0.8) + ' l0,' + N(h * 0.3) + ' M' + N(r * 0.35) + ',' + N(-h * 0.55) + ' l0,' + N(h * 0.35), 'none', 3.4);
    s += rect(-r - 4, -h * 0.72, r * 2 + 8, 22, 8, C.sand, 5) + path('M' + N(-r) + ',' + N(-h * 0.72 + 11) + ' L' + N(r) + ',' + N(-h * 0.72 + 11), 'none', 3, ' stroke-dasharray="8 6"');
    return place(o, s);
  };
  K.dock = function (o) {
    o = o || {};
    var w = o.w || 800, h = o.h || 44, s = '';
    (o.legs || []).forEach(function (x) { s += K.piling({ x: x, y: o.legH || 320, h: (o.legH || 320) + 20, r: 26 }); });
    s += rect(0, -16, w, 18, 4, C.tan, PW) + rect(0, 0, w, h, 4, C.brown, PW);
    var d = ''; for (var x = 110; x < w; x += 140) d += 'M' + x + ',2 L' + x + ',' + (h - 2) + ' ';
    s += path(d, 'none', 4);
    var nl = ''; for (var x2 = 30; x2 < w; x2 += 140) nl += circ(x2, h / 2, 3.5, INK, 0) + circ(x2 + 60, h / 2, 3.5, INK, 0);
    return place(o, s + nl);
  };
  K.gull = function (o) {
    o = o || {};
    var f = o.flap == null ? 0 : o.flap, wy = lerp(-26, 10, f);
    var d = 'M-56,' + N(wy * 0.4) + ' Q-30,' + N(wy) + ' -4,-2 Q0,4 4,-2 Q30,' + N(wy) + ' 56,' + N(wy * 0.4);
    return place(o, path(d, 'none', 20, '', INK) + path(d, 'none', 9, '', C.white) + path('M-4,0 L4,0 L0,12 Z', C.orange, 3));
  };
  K.lighthouse = function (o) {
    o = o || {};
    var h = o.h || 200, s = '';
    s += path('M-26,0 L-16,' + N(-h) + ' L16,' + N(-h) + ' L26,0 Z', C.cream, 5);
    s += path('M' + N(-24) + ',' + N(-h * 0.3) + ' L24,' + N(-h * 0.3) + ' L22,' + N(-h * 0.45) + ' L-22,' + N(-h * 0.45) + ' Z M-20,' + N(-h * 0.62) + ' L20,' + N(-h * 0.62) + ' L18,' + N(-h * 0.77) + ' L-18,' + N(-h * 0.77) + ' Z', C.brick, 4);
    s += rect(-16, -h - 30, 32, 30, 3, C.mustard, 5) + path('M-22,' + N(-h - 30) + ' L0,' + N(-h - 54) + ' L22,' + N(-h - 30) + ' Z', C.brick, 5);
    return place(o, s);
  };
  K.ghostBoat = function (o) {
    o = o || {};
    var s = '', gc = C.gray;
    s += path('M-70,-60 L-20,-60 L-20,-96 L30,-96 L40,-60 L80,-60 Q70,-20 50,-6 Q40,4 30,-6 Q20,6 8,-6 Q-4,6 -16,-6 Q-28,6 -40,-6 Q-60,-20 -70,-60 Z', C.cream, 6, ' stroke-dasharray="14 9"', gc);
    s += path('M-4,-86 L16,-86 L20,-70 L-4,-70 Z', 'none', 3.5, '', gc);
    s += ell(-30, -38, 6, 9, INK, 0) + ell(0, -38, 6, 9, INK, 0) + ell(-15, -22, 6, 4, INK, 0);
    return place(o, s);
  };
  K.gillnet = function (o) {
    o = o || {};
    var w = o.w || 460, h = o.h || 220, st = o.mesh || 40, s = '', d = '', c, y0, y1;
    for (c = -h; c < w; c += st) { y0 = Math.max(0, -c); y1 = Math.min(h, w - c); if (y1 > y0) d += 'M' + N(y0 + c) + ',' + N(y0) + ' L' + N(y1 + c) + ',' + N(y1) + ' '; }
    for (c = st; c < w + h; c += st) { y0 = Math.max(0, c - w); y1 = Math.min(h, c); if (y1 > y0) d += 'M' + N(c - y0) + ',' + N(y0) + ' L' + N(c - y1) + ',' + N(y1) + ' '; }
    s += path(d, 'none', 2.6);
    s += path('M0,0 L' + w + ',0', 'none', 6, '', C.brown) + path('M0,' + h + ' L' + w + ',' + h, 'none', 6);
    for (var f = 20; f < w; f += 70) s += ell(f, 0, 20, 12, C.mustard, 4.5);
    for (var k = 30; k < w; k += 70) s += rect(k - 6, h - 6, 12, 12, 2, C.ink, 0);
    return place(o, g(s, 'translate(' + N(-w / 2) + ' 0)'));
  };
  /* --- s09 pie server: brown handle, silver ferrule, an offset neck that steps down to a flat
     triangular blade shaped like a slice of pie: wide and squared at the heel, short, with a
     rounded tip, a serrated cutting edge underneath and one highlight. Origin: handle end,
     blade to the right (the blade's centre line sits 16 px below the handle's). */
  K.pieServer = function (o) {
    o = o || {};
    var s = tube('M0,0 L108,0', 24, C.brown, 5) + rect(102, -14, 24, 28, 5, C.silver, 5);
    s += tube('M124,0 L138,0 L154,16 L170,16', 12, C.silver, 4.5);
    // blade: squared heel (x 166, y -40..72), straight top edge, rounded tip, serrated underside
    var d = 'M166,-34 Q166,-40 172,-40 L268,4 Q286,14 268,28', n = 8;
    for (var i = 1; i <= n; i++) {
      var tm = (i - 0.5) / n, te = i / n;
      d += ' L' + P(lerp(268, 170, tm) + 2, lerp(28, 72, tm) + 5) + ' L' + P(lerp(268, 170, te), lerp(28, 72, te));
    }
    s += path(d + ' Q166,72 166,66 Z', C.silver, PW);
    s += path('M182,-24 L252,8', 'none', 6, '', C.white);
    return place(o, s);
  };


  /* --- s13 peer review: a giant magnifying glass with cartoon eyes seen in the lens.
     blink true shuts both eyes; look [x, y]. Origin: bottom of the handle, lens up. */
  K.magnifier = function (o) {
    o = o || {};
    var lv = lookVec(o.look == null ? [0.3, 0.2] : o.look), s = '', cy = -318;
    s += tube('M0,0 L0,-196', 34, C.brown, 6) + rect(-24, -222, 48, 36, 8, C.mustard, PW);
    s += circ(0, cy, 112, C.mustard, PW) + circ(0, cy, 88, C.white, 6);
    [[-34, 0], [34, -2]].forEach(function (e, i) {
      var ex = e[0], ey = cy + e[1];
      if (o.blink) s += ell(ex, ey, 27, 33, C.mustard, 5) + path('M' + P(ex - 24, ey + 4) + ' Q' + P(ex, ey + 18) + ' ' + P(ex + 24, ey + 4), 'none', 5);
      else {
        s += ell(ex, ey, 27, 33, C.white, 5) + circ(ex + lv[0] * 10, ey + lv[1] * 12, 12, INK, 0) + circ(ex + lv[0] * 10 - 4, ey + lv[1] * 12 - 5, 4, C.white, 0);
        s += path('M' + P(ex - 24, ey - 22) + ' Q' + P(ex, ey - 34) + ' ' + P(ex + 24, ey - 22) + ' L' + P(ex + 24, ey - 30) + ' Q' + P(ex, ey - 42) + ' ' + P(ex - 24, ey - 30) + ' Z', C.mustard, 0);
      }
      s += path('M' + P(ex - 22, ey - 46 - (i ? 4 : 0)) + ' Q' + P(ex, ey - 56) + ' ' + P(ex + 22, ey - 48 + (i ? 0 : 4)), 'none', 6);
    });
    s += path('M-62,' + (cy - 30) + ' Q-56,' + (cy - 62) + ' -26,' + (cy - 74), 'none', 6, '', C.sky);
    return place(o, s);
  };
  /* The three reviewers leaning in. blinks = [b0, b1, b2], or T (global seconds) to blink them
     one after another on the beat. gap = spacing. Origin: middle glass's handle end. */
  K.reviewers = function (o) {
    o = o || {};
    var s = '', gap = o.gap || 250, beat = 60 / 104, on = -1;
    if (o.T != null) { var b = Math.floor(o.T / beat * 2) % 8; on = b < 6 ? Math.floor(b / 2) : -1; if (Math.floor(o.T / beat * 2) % 2) on = -1; }
    [[-gap, 18, -16, [0.6, 0.5]], [0, 0, -6, [0.4, 0.6]], [gap, 26, 6, [0.1, 0.6]]].forEach(function (r, i) {
      var bl = o.blinks ? !!o.blinks[i] : on === i;
      s += K.magnifier({ x: r[0], y: r[1], rot: r[2], blink: bl, look: r[3] });
    });
    return place(o, s);
  };

  /* --- s03 exit poll: cream booth with a seaDeep curtain lettered VOTE.
     curtain 0 closed .. 1 drawn aside. Origin: bottom centre (about 360 x 720). */
  K.voteBooth = function (o) {
    o = o || {};
    var cp = clamp(o.curtain || 0, 0, 1), s = '', lbl = o.label || 'VOTE';
    s += rect(-170, -40, 26, 40, 4, C.brown, PW) + rect(144, -40, 26, 40, 4, C.brown, PW);
    s += rect(-180, -680, 360, 648, 12, C.cream, PW);
    s += rect(-150, -620, 300, 560, 8, C.brown, 5);
    s += rect(-200, -726, 400, 58, 12, C.brown, PW) + path('M-180,-697 L180,-697', 'none', 3, '', C.tan);
    s += path('M-160,-620 L160,-620', 'none', 10);
    var cw = lerp(300, 70, cp), x0 = -150, d = '';
    s += path('M' + N(x0) + ',-620 L' + N(x0 + cw) + ',-620 Q' + N(x0 + cw + 6) + ',-340 ' + N(x0 + cw - 4) + ',-62 L' + N(x0) + ',-62 Z', C.seaDeep, PW);
    for (var i = 1; i < 5; i++) { var fx = x0 + cw * i / 5; d += 'M' + N(fx) + ',-606 Q' + N(fx + 8) + ',-340 ' + N(fx - 2) + ',-76 '; }
    s += path(d, 'none', 3.4, ' opacity=".7"', INK);
    if (cp < 0.35) s += K.text(lbl, x0 + cw / 2, -470, { size: 92, font: 'label', fill: C.cream, stroke: INK, strokeW: 8 });
    else s += K.tag(lbl, 0, -760, { size: 44 });
    return place(o, s);
  };

  /* --- s13 ingredients for the stock pot. kind 'can' (CORRECTED COUNT), 'jar' (NEW RELEASE
     DEATH RATE) or 'box' (MAYBE A NEW MATH MODEL (WHAM)); label overrides. Origin: bottom centre. */
  K.ingredient = function (o) {
    o = o || {};
    var kind = o.kind || 'can', s = '';
    if (kind === 'can') {
      var lb = o.label || 'CORRECTED COUNT';
      s += path('M-80,-200 L-80,-12 Q0,10 80,-12 L80,-200 Z', C.sea, PW) + ell(0, -200, 80, 20, C.silver, PW) + ell(0, -200, 60, 12, 'none', 3.4);
      s += path('M-80,-160 Q0,-142 80,-160 L80,-54 Q0,-36 -80,-54 Z', C.cream, 5);
      s += multiText(lb, 0, -100, 30, 10, { font: 'label' });
      s += g(tube('M-30,2 L-8,26 L34,-28', 12, C.cream, 4.5), 'translate(60 -176) scale(0.6)');
    } else if (kind === 'jar') {
      var lj = o.label || 'NEW RELEASE DEATH RATE';
      s += path('M-66,-196 Q-86,-190 -86,-160 L-86,-26 Q-86,0 -60,0 L60,0 Q86,0 86,-26 L86,-160 Q86,-190 66,-196 Z', C.white, PW);
      s += rect(-62, -236, 124, 44, 10, C.brown, PW) + path('M-50,-222 L50,-222 M-50,-208 L50,-208', 'none', 3, '', C.tan);
      s += path('M-66,-150 Q-60,-176 -40,-182', 'none', 5, '', C.sky);
      s += rect(-76, -150, 152, 132, 8, C.paper, 5) + multiText(lj, 0, -84, 24, 9, { font: 'label' });
    } else {
      var lx = o.label || 'MAYBE A NEW MATH MODEL (WHAM)';
      s += path('M-130,-168 L-150,-214 L-40,-196 Z', C.tan, PW) + path('M130,-168 L154,-210 L40,-196 Z', C.tan, PW);
      s += rect(-130, -170, 260, 170, 6, C.tan, PW) + path('M-130,-150 L130,-150', 'none', 3.4) + path('M0,-170 L0,-150', 'none', 3.4);
      s += rect(-112, -136, 224, 116, 8, C.cream, 5) + multiText(lx, 0, -78, 28, 12, { font: 'label' });
    }
    return place(o, s);
  };

  /* --- s07 the long ledger scroll on its brown easel. unroll 0..1 lets the left end roll out a
     long way (extra px) with small unlabeled year ticks along the bottom. The CORRECTED stamp
     lands on it (K.stampMark). Origin: ground centre of the easel. */
  K.ledgerScroll = function (o) {
    o = o || {};
    var w = o.w || 760, h = o.h || 300, lh = o.legH == null ? 260 : o.legH, u = clamp(o.unroll || 0, 0, 1), ex = o.extra || 820, s = '';
    var top = -lh - h, xl = -w / 2 - u * ex, xr = w / 2;
    // easel legs behind
    s += path('M-220,0 L-120,' + N(-lh - h * 0.6) + ' M220,0 L120,' + N(-lh - h * 0.6) + ' M0,' + N(-lh + 10) + ' L0,-10', 'none', 26, '', INK) + path('M-220,0 L-120,' + N(-lh - h * 0.6) + ' M220,0 L120,' + N(-lh - h * 0.6) + ' M0,' + N(-lh + 10) + ' L0,-10', 'none', 14, '', C.brown);
    s += rect(-300, -lh - 6, 600, 24, 6, C.brown, PW);
    // the paper
    s += rect(xl, top, xr - xl, h, 4, C.paper, PW);
    var d = '', y;
    for (y = top + 44; y < top + h - 40; y += 34) d += 'M' + N(xl + 50) + ',' + N(y) + ' q' + N(30) + ',-6 60,0 t60,0 t40,0 M' + N(xr - 330) + ',' + N(y) + ' q20,-5 40,0 t40,0 t40,0 ';
    s += path(d, 'none', 3.2);
    s += path('M' + N(xr - 110) + ',' + N(top + 16) + ' L' + N(xr - 110) + ',' + N(top + h - 16), 'none', 3, '', C.brick);
    for (var j = 0; j < 6; j++) s += g(fishIcon(0.34), 'translate(' + N(xr - 64) + ' ' + N(top + 38 + j * 44) + ')');
    if (u > 0) { var tk = ''; for (var x = xl + 40; x < xr - 140; x += 48) tk += 'M' + N(x) + ',' + N(top + h - 8) + ' l0,-18 '; s += path(tk, 'none', 3.4); }
    // rolls at each end
    [xl, xr].forEach(function (x) { s += rect(x - 22, top - 18, 44, h + 36, 18, C.paper, PW) + ell(x, top - 6, 14, 8, 'none', 3.4) + path('M' + N(x) + ',' + N(top - 6) + ' m-6,0 a6,4 0 1,1 12,0', 'none', 3); });
    return place(o, s);
  };

  /* A simple striper for crowds and the SOMEDAY wish (no bow tie, no hat): torpedo body with a
     seaDeep back, cream belly, three stripes, big eye, forked tail. About 110 px long at size 1,
     facing right. Origin centre. */
  function simpleStriper(bob) {
    var s = '';
    s += path('M-40,0 L-63,-21 Q-55,0 -63,21 Z', C.silver, 4.2) + path('M-50,-10 L-58,-15 M-50,10 L-58,15', 'none', 2.6);
    s += path('M-8,-22 L2,-36 Q12,-34 20,-21 Z', C.silver, 4.2);
    var bodyD = 'M49,3 Q42,-22 2,-24 Q-30,-22 -44,-5 Q-48,0 -44,5 Q-30,20 2,22 Q40,22 49,3 Z';
    s += path(bodyD, C.silver, 0);
    s += path('M45,-6 Q38,-22 2,-24 Q-30,-22 -44,-5 Q-26,-13 2,-14 Q30,-14 45,-6 Z', C.seaDeep, 0);
    s += path('M45,9 Q34,21 2,22 Q-28,20 -43,5 Q-22,12 2,12 Q30,12 45,9 Z', C.cream, 0);
    s += path('M-36,-8 Q-4,-11 24,-8 M-38,-1 Q-4,-3 26,-1 M-36,5 Q-6,6 22,6', 'none', 3.6, '', C.stripe);
    s += path(bodyD, 'none', 4.6);
    s += path('M22,-18 Q18,0 24,18', 'none', 3);
    s += circ(33, -6, 8, C.white, 3.2) + circ(35 + (bob || 0), -6, 3.8, INK, 0) + path('M49,5 L40,7', 'none', 3);
    return s;
  }
  /* K.swimSchool({n, w, h, size, seed, T}): about twenty simple stripers swimming together to
     the right in a loose school (s14 SOMEDAY bubble). T (global seconds) bobs them on the beat,
     one after another. Origin centre; fits in w x h. */
  K.swimSchool = function (o) {
    o = o || {};
    var n = o.n || 20, w = o.w || 380, h = o.h || 170, sz = o.size || 0.55, seed = o.seed || 1, s = '', pts = [];
    // a loose oval school: staggered spots nearest the middle, jittered a little
    var dx = 118 * sz, dy = 52 * sz, cand = [];
    for (var r = -8; r <= 8; r++) for (var c = -10; c <= 10; c++) {
      var x = (c + (r % 2 ? 0.5 : 0)) * dx, y = r * dy, e = (x * x) / (w * w / 4) + (y * y) / (h * h / 4);
      if (Math.abs(x) <= w / 2 - 55 * sz && Math.abs(y) <= h / 2 - 22 * sz) cand.push([x, y, e]);
    }
    cand.sort(function (a, b) { return a[2] - b[2]; });
    for (var i = 0; i < Math.min(n, cand.length); i++) {
      var bob = o.T != null ? K.beat(o.T - (i % 4) * 60 / 104) * -6 : 0;
      pts.push([cand[i][0] + (hash(seed * 5.3 + i * 1.7) - 0.5) * 16 * sz, cand[i][1] + bob + (hash(seed * 2.9 + i * 3.1) - 0.5) * 12 * sz, 1 + (hash(seed + i * 0.7) - 0.5) * 0.16]);
    }
    pts.sort(function (a, b) { return a[1] - b[1]; }).forEach(function (p) { s += g(simpleStriper(0), 'translate(' + P(p[0], p[1]) + ') scale(' + N(sz * p[2] * 1000) / 1000 + ')'); });
    return place(o, s);
  };

  K.thought = function (o) {
    o = o || {};
    var w = o.w || 460, h = o.h || 300, st = o.stage == null ? 3 : o.stage, tl = o.tail || [-0.6, 1], s = '';
    var tn = len(tl) || 1, tv = [tl[0] / tn, tl[1] / tn];
    var dots = [[0.2, 24], [0.46, 16], [0.68, 10]];
    dots.forEach(function (dd, i) { if (st >= 1 && (st >= 2 || i === 2) || st >= 3) { var p = [tv[0] * (w * 0.5 + 30 + dd[0] * w * 0.3), tv[1] * (h * 0.5 + 30 + dd[0] * h * 0.4)]; s += circ(p[0], p[1], dd[1], C.white, 5); } });
    if (st >= 2 && st < 3) s += circ(tv[0] * w * 0.3, tv[1] * h * 0.36, 44, C.white, 5);
    if (st >= 3) {
      var pts = [], n = 11;
      for (var i = 0; i < n * 2; i++) { var a = i / (n * 2) * Math.PI * 2, rr = i % 2 ? 1 : 0.86; pts.push([Math.cos(a) * w / 2 * rr, Math.sin(a) * h / 2 * rr]); }
      s += path(smooth(pts, true, 1.1), C.white, 6);
      if (o.inner) s += '<svg x="' + N(-w * 0.4) + '" y="' + N(-h * 0.38) + '" width="' + N(w * 0.8) + '" height="' + N(h * 0.76) + '" viewBox="' + N(-w * 0.4) + ' ' + N(-h * 0.38) + ' ' + N(w * 0.8) + ' ' + N(h * 0.76) + '" overflow="hidden">' + o.inner + '</svg>';
    }
    return place(o, s);
  };
})();
