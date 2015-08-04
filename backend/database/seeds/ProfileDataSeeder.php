<?php

# database/seeds/ProfileTableSeeder.php

use App\Models\Profile;
use App\Models\ProfileAttribute;
use App\Models\ProfileNote;
use App\Models\ProfileNoteType;
use App\Models\ProfileEmployment;
use App\Models\ProfileLog;
use App\Models\Attribute;
use Illuminate\Database\Seeder;

class ProfileTableSeeder extends Seeder
{

  private static $names = array(
    'm' => array('Jamel Eberhart', 'Caleb Dyment', 'Rich Talmage', 'Emilio Talamantez', 'Lenny Suhr', 'Courtney Sultan', 'Donny Ratti', 'Shane Mcmonagle', 'Clyde Acheson', 'Octavio Dufresne', 'Rickie Maher', 'Dillon Quellette', 'Carl Laury', 'Scotty Telfer', 'Jefferey Sterling', 'Grant Rose', 'Del Castaldo', 'Ismael Shattuck', 'Abel Parke', 'Kelly Cantor', 'Hung Keppler', 'Marco Kubat', 'Florentino Bondi', 'Michel Degroot', 'Rolland Ariola', 'Phillip Rench', 'Kendrick Smeltzer', 'Trenton Maysonet', 'Fabian Penland', 'Matthew Aubrey', 'Jay Pridmore', 'Abdul Marling', 'Marcus Samayoa', 'Alvin Pinelli', 'Rogelio Badger', 'Thad Hennig', 'Olen Dulaney', 'Rodney Colson', 'Rex Ribble', 'Lowell Rojo', 'Owen Needham', 'Aaron Polster', 'Blake Gilkey', 'Jeffry Doles', 'Drew Damato', 'Brendan Farthing', 'Donnell Dowe', 'Pasquale Grose', 'Ivory Bickel', 'Stevie Hite', 'Earl Russell', 'Brian Martin', 'Richard Washington', 'Gary Rogers', 'Frank Thomas', 'Joseph Bell', 'Clarence Hill', 'Albert Carter', 'Jason Gonzales', 'William Jenkins', 'James Phillips', 'Justin Rodriguez', 'Martin Powell', 'Victor Ross', 'Nicholas Thompson', 'Willie Griffin', 'Jeffrey Lewis', 'Brandon Allen', 'Ernest Morgan', 'Adam Brooks', 'Stephen Flores', 'Bobby Nelson', 'Jack Ramirez', 'Jimmy Collins', 'Henry Patterson', 'Carl Davis', 'Christopher Smith', 'Walter Peterson', 'Benjamin Robinson', 'Larry Wilson', 'Randy Perry', 'Dennis Turner', 'Samuel Gonzalez', 'Wayne Harris', 'Aaron King', 'Juan Bryant', 'Steve Coleman', 'George Watson', 'Donald Baker', 'Raymond Green', 'David Simmons', 'Harry Lee', 'Robert Cox', 'Billy Evans', 'Thomas Price', 'Patrick Butler', 'Chris White', 'Howard James', 'Anthony Cook', 'Arthur Jones'),
    'f' => array('Mora Tarin', 'Lurlene Speno', 'Lise Kraatz', 'Magdalena Munden', 'Farah Cropp', 'Bernita Defrank', 'Noemi Mccomas', 'Ranae Riggleman', 'Lavada Police', 'Sherice Scheck', 'Kathie Wiest', 'Nu Sealey', 'Devorah Perkinson', 'Particia Osborne', 'Felicita Kinser', 'Stefania Adan', 'Joanne Buel', 'Mira Reddix', 'Reiko Heyen', 'Kellie Hodson', 'Vena Combes', 'Kristina Arter', 'Alpha Liang', 'Florine Silversmith', 'Yvone Norville', 'Ernestina Hauff', 'Jeniffer Borst', 'Celestina Fucci', 'Shanelle Riva', 'Essie Ney', 'Tomeka Vien', 'Gidget Mccarville', 'Miranda Meloy', 'Consuelo Fontenot', 'Nam Alleman', 'Jazmine Knowlton', 'Huong Morabito', 'Daina Molander', 'Lois Moshier', 'Silvia Gardella', 'Joetta Coolidge', 'Anika Trost', 'Hettie Cousar', 'Mamie Siegfried', 'Yadira Glessner', 'Britta Sy', 'Marica Curtin', 'Stephania Doonan', 'Nathalie Threatt', 'Isela Mckinzie', 'Andrea Henderson', 'Christina Perry', 'Kelly Stewart', 'Christine Mitchell', 'Sandra Baker', 'Julie Brooks', 'Helen Cook', 'Rose Torres', 'Elizabeth Hall', 'Jennifer Martinez', 'Betty Bailey', 'Michelle Turner', 'Donna Sanchez', 'Marie Watson', 'Frances Hill', 'Laura Ramirez', 'Lois Adams', 'Karen Bell', 'Virginia Ward', 'Evelyn Lewis', 'Martha Bennett', 'Amy Phillips', 'Paula Scott', 'Pamela Harris', 'Lillian Davis', 'Diana Lee', 'Maria Wood', 'Dorothy Price', 'Janice Johnson', 'Wanda Patterson', 'Shirley Thomas', 'Kathryn Nelson', 'Debra Long', 'Ashley Edwards', 'Anne Miller', 'Emily Morgan', 'Melissa Griffin', 'Louise Evans', 'Heather Alexander', 'Alice White', 'Joyce Hughes', 'Angela Thompson', 'Mary Collins', 'Doris Gray', 'Judith Coleman', 'Nicole Foster', 'Linda Williams', 'Sarah Richardson', 'Jean Parker', 'Deborah Morris')
  );

  private static $reference_names = array('Oscar Allison', 'Nicole Cunningham', 'Melinda Hampton', 'Janie Cobb', 'Shelly Saunders', 'Rodney Black', 'Lawrence Bryant', 'Agnes Weber', 'Patty Ryan', 'Gloria Richards', 'Annie Gonzales', 'Norman George', 'Pearl Montgomery', 'Terry Roberson', 'Shawna Cummings', 'Wilfred Hawkins', 'Israel Day', 'Maurice Lambert', 'Neal Williamson', 'Brendan Baldwin', 'Kelvin Foster', 'Edna Parker', 'Jeremy Wood', 'Adam Stevenson', 'Henry Pope', 'Lloyd Rodriguez', 'Ivan Higgins', 'Debbie Simmons', 'Leigh Nichols', 'Sandy Moody', 'Rosemarie Alvarez', 'Ron Collier', 'Kathy Chavez', 'Dora Beck', 'Julia Scott', 'Warren Mendoza', 'Deanna Bowman', 'Zachary Dennis', 'Arturo Ray', 'Marcus Stone', 'Robin Spencer', 'Grace Wilkerson', 'Loren Hubbard', 'Alexander Dawson', 'Ken Page', 'Jonathan Douglas', 'Eugene Guerrero', 'Danielle Willis', 'Bernadette Collins', 'Wilma Sandoval', 'Jorge Conner', 'Ginger Perez', 'Archie Chambers', 'Shane Johnston', 'Barry Fisher', 'Leonard Barber', 'Inez Ortega', 'Hubert Ellis', 'Reginald Watkins', 'Floyd Schneider', 'Dana Salazar', 'Darin Jimenez', 'Nichole Knight', 'Bernard Curry', 'Philip Nguyen', 'Terence Cruz', 'Edith Frazier', 'Jimmy Davidson', 'Sarah Blake', 'Sheldon Wolfe', 'Bobby Clayton', 'Joanne Reynolds', 'Terrell Santos', 'Yvette Mack', 'Lillian Pena', 'Dawn Graves', 'Randolph Fletcher', 'Tabitha Gomez', 'Marco Horton', 'Julie Greer', 'Ervin Dean', 'Ian Garza', 'Elaine Mullins', 'Sara Luna', 'Silvia Massey', 'Paulette Williams', 'Dianna Hodges', 'Delia Bradley', 'Randall Walton', 'Roger Morton', 'Roman Ramos', 'Derek Jensen', 'Arlene Peterson', 'Rickey Stanley', 'Nadine Warner', 'Darlene Hansen', 'Alejandro Moss', 'Violet Wade', 'Carol Owens', 'Jean Goodwin');

  private static $jobs = array(
      array(
        'employers' => array('Restaurant Santabrasa', 'Café Orly Schopdog', 'Restaurant Ají Seco Místico', 'Kintaro Sushi', 'Tanta Restaurant'),
        'positions' => array('Garzón/a', 'Anfitriona', 'Cocinero/a', 'Jefe de Garzones', 'Maitre', 'Barman', 'Copero')
      ),
      array(
        'employers' => array('Hotel El Director', 'Hotel Regal Pacific', 'Hotel Atton', 'Hotel Plaza El Bosque Ebro', 'Hotel Diego de Almagro', 'Hotel Renaissance', 'Hotel Los Nogales'),
        'positions' => array('Mucama', 'Aseador', 'Barman', 'Cocinero/a', 'Garzón/a', 'Steward')
      ),
      array(
        'employers' => array('Domicilio particular'),
        'positions' => array('Empleada doméstica', 'Niñero/a')
      ),
      array(
        'employers' => array('Andina del Sud', 'Euroandino'),
        'positions' => array('Guía turístico', 'Agente de ventas', 'Secretaria')
      ),
      array(
        'employers' => array('Falabella', 'Almacenes Paris', 'La Polar', 'Movistar', 'VTR', 'GTD Manquehue'),
        'positions' => array('Promotor/a', 'Vendedor/a', 'Cajero/a', 'Servicio al cliente')
      ),
      array(
        'employers' => array('Starbucks Coffee', 'Café Juan Valdez'),
        'positions' => array('Barista')
      ),
      array(
        'employers' => array('Yogen Fruz'),
        'positions' => array('Supervisor de Local')
      ),
      array(
        'employers' => array('Telepizza', 'Doggis', 'Fritz', 'Juan Maestro'),
        'positions' => array('Cajero/a', 'Cocinero/a')
      ),
      array(
        'employers' => array('Clínica Vitacura', 'Clínica Las Nieves'),
        'positions' => array('Encargado/a de bodega')
      ),
      array(
        'employers' => array('Panadería Lo Saldes'),
        'positions' => array('Panadero/a', 'Cajero/a')
      ),
      array(
        'employers' => array('OK Market', 'Big John'),
        'positions' => array('Cajero/a')
      )
    );

  private static $baconipsum = array(
    'Eiusmod capicola non drumstick consectetur duis, ullamco veniam.  Eu quis est chuck.  Ex nisi ullamco pork loin ball tip.  Dolor laboris sausage adipisicing, jowl meatloaf andouille ham.  Picanha nostrud bacon sausage swine, sunt t-bone ribeye biltong velit anim.  Pancetta sint cupidatat pig, venison landjaeger flank pastrami.  Ribeye boudin filet mignon ullamco veniam proident sunt.',
    'In do dolore, cupidatat ut andouille qui lorem prosciutto.  Adipisicing lorem meatloaf, pork chop culpa aute hamburger voluptate exercitation ea flank jerky proident magna.  Sed irure flank, boudin alcatra hamburger sausage fatback.  Capicola ham porchetta chicken spare ribs pancetta ball tip.  Corned beef proident exercitation magna qui mollit.  Mollit porchetta spare ribs ham boudin tenderloin.',
    'Tempor labore pancetta sirloin sint quis, chicken shankle tri-tip anim irure nisi.  Corned beef magna fatback kevin ham nostrud flank cow sint cillum.  Tempor dolore laboris proident duis porchetta.  Ground round cillum adipisicing aute tri-tip, esse ad.  Meatloaf strip steak laborum, turkey veniam consequat andouille ad shoulder frankfurter in swine tenderloin sunt culpa.  Ut do landjaeger, cupidatat culpa turducken capicola tri-tip bresaola esse sirloin.',
    'Labore aliqua irure pork culpa cupidatat consectetur quis lorem.  Cupim kevin ipsum in ut fugiat.  Kielbasa tri-tip velit, boudin fugiat qui alcatra laborum.  Laboris nulla ham pork venison in duis eiusmod.',
    'T-bone pork turducken occaecat, deserunt meatball proident leberkas.  Aliquip id quis aliqua doner, dolor pork lorem ipsum sausage sunt magna ham hock pork loin minim.  Shank elit culpa, strip steak turducken sirloin shoulder tenderloin.  Ham magna qui bresaola, beef ribs ipsum pancetta pariatur do anim et.  Laboris drumstick beef, aliquip dolor non ullamco aliqua landjaeger tempor.  Cillum eu nisi pastrami.',
    'Voluptate adipisicing est cupidatat.  Quis qui in aute, hamburger filet mignon non ut pancetta voluptate.  Pork drumstick magna, capicola est enim pork loin beef minim pancetta jerky ground round tenderloin sunt.  Magna porchetta voluptate dolor nulla pastrami elit prosciutto eu occaecat.  Ea commodo laborum, swine venison deserunt cupidatat beef ribs hamburger andouille aute ut esse.  Magna andouille strip steak brisket.',
    'Quis duis non id jowl ground round reprehenderit turkey pork chop sint cupim.  Boudin beef ribs exercitation ut incididunt officia irure corned beef t-bone sausage.  Fatback sed sausage tempor chicken.  Cillum in ball tip ullamco brisket andouille chuck enim sausage eiusmod exercitation capicola voluptate short ribs.  Aute esse magna exercitation tongue nostrud velit swine dolore aliqua chuck veniam turducken filet mignon.  Exercitation adipisicing pastrami cupim commodo.',
    'Aliqua rump shankle shank, tongue fatback prosciutto cow meatloaf eiusmod beef ribs.  Adipisicing bresaola kevin, beef ribs velit flank bacon prosciutto in cupidatat pork belly occaecat beef sunt.  Spare ribs alcatra labore esse pancetta duis sed kevin landjaeger occaecat biltong eu leberkas.  Nisi jowl quis, drumstick occaecat corned beef sirloin.  Chicken ut aliqua sunt turducken anim voluptate alcatra ad jerky adipisicing brisket.  Pork belly culpa proident tenderloin officia tri-tip spare ribs.  Ipsum doner sirloin, chicken turkey shankle in corned beef ea tenderloin irure short loin.',
    'Nulla magna ribeye non occaecat mollit, tongue pork loin tenderloin ipsum fugiat in pork belly pastrami.  Landjaeger rump incididunt eu boudin.  Sed fugiat commodo porchetta dolore, brisket boudin.  Brisket fatback esse strip steak doner.',
    'Kevin tri-tip dolore eiusmod esse ball tip fugiat pariatur est nisi proident ham hock.  Ball tip minim elit chuck jerky reprehenderit.  Turducken ad brisket quis.  Ham hock deserunt spare ribs in, pastrami pork loin do.  Sausage kielbasa pork esse shankle adipisicing sirloin fugiat sint chuck alcatra pastrami.  Aute ut labore landjaeger.',
    'Kielbasa sed drumstick nostrud excepteur doner.  Ad pastrami pancetta minim andouille ribeye.  Eu short loin est porchetta salami.  Ut ad dolor pancetta doner pork loin.  Magna adipisicing pig ground round.  Ut filet mignon incididunt, elit venison bresaola pancetta kielbasa cillum prosciutto chicken.',
    'Adipisicing landjaeger cupidatat, irure shankle velit incididunt pork loin tenderloin sirloin turducken excepteur.  Tenderloin bacon nulla consequat turkey, quis jowl reprehenderit.  Voluptate fugiat est officia spare ribs turkey.  Meatloaf turducken ullamco tri-tip shoulder eiusmod drumstick non dolor occaecat strip steak.  Consectetur ut rump cupim, minim anim incididunt qui.  Shank qui in, exercitation cillum nostrud turkey pig minim drumstick eu lorem tri-tip.  Ad ullamco reprehenderit eiusmod enim bacon.',
    'Qui picanha short loin beef ribs proident.  Aliqua kielbasa ex, ut est short loin magna ball tip do meatball.  Ad do est anim fugiat in voluptate boudin sunt minim esse ullamco fatback biltong salami.  Boudin culpa doner quis lorem dolore.  Capicola bresaola jowl duis magna ground round incididunt cillum labore.  Doner proident exercitation pig.  Pariatur cillum short loin tri-tip alcatra shoulder lorem t-bone.',
    'Picanha tenderloin meatloaf ham sed strip steak sirloin excepteur quis ball tip pig occaecat tempor ut.  Tri-tip fatback chuck irure.  Shoulder ut hamburger spare ribs consequat.  In consectetur laboris eu.  Reprehenderit magna aliquip, proident pastrami nisi alcatra ut sunt anim capicola jowl strip steak beef ribs cupidatat.  Veniam pork brisket chuck cow, magna picanha ribeye in turducken aliquip bresaola drumstick do shoulder.  Leberkas mollit aute ut t-bone et ea proident hamburger chuck occaecat turkey.',
    'Reprehenderit venison sed, tongue dolore jerky tempor mollit qui quis nostrud.  Turducken nisi id sed consequat, quis capicola.  Rump officia sunt qui lorem voluptate flank.  Excepteur chicken andouille lorem.  Meatloaf beef ribs tri-tip eu fugiat, incididunt ground round qui consectetur nostrud.  Sint biltong pork chop incididunt cow cupidatat culpa voluptate quis nostrud bacon chuck leberkas filet mignon sed.  Nostrud aliqua mollit incididunt short ribs boudin turducken andouille pork loin ex cow qui.',
    'Flank excepteur ad shankle, voluptate frankfurter reprehenderit ea ham cupim filet mignon beef ribs.  Salami turducken strip steak in adipisicing voluptate proident sed.  Meatball elit culpa, tenderloin deserunt sunt excepteur veniam.  Veniam do flank velit tail.  Chuck pig in, sunt dolore cupidatat ullamco.',
    'Beef in culpa id turducken chuck proident, spare ribs dolore hamburger ut lorem chicken.  Dolore magna pastrami ad ut, do landjaeger shoulder in pork chop.  Occaecat ball tip salami, turducken shankle et in short loin filet mignon pork.  Strip steak corned beef turducken chicken excepteur incididunt.  Excepteur doner id nulla, in landjaeger ullamco enim veniam turducken officia ipsum occaecat pork loin.  Venison fatback magna ullamco biltong anim ham hock.',
    'T-bone proident velit fugiat meatloaf doner short ribs fatback pariatur, corned beef eiusmod.  Nostrud ea venison pork loin laboris ground round jowl elit.  Boudin bacon in pork loin pig culpa.  Fatback salami aute elit et veniam.  Eu pariatur filet mignon in sint.  Chuck nostrud ex id consectetur hamburger corned beef prosciutto commodo pariatur turkey lorem boudin tri-tip aliqua.',
    'Laborum ball tip strip steak meatball excepteur culpa fugiat velit incididunt reprehenderit minim biltong meatloaf commodo in.  Filet mignon jowl brisket mollit tenderloin, nulla tri-tip non.  Id occaecat commodo t-bone, filet mignon aliquip corned beef deserunt leberkas aliqua enim ground round.  Turkey spare ribs drumstick jerky exercitation hamburger, ea doner reprehenderit shankle cupidatat.  Non corned beef beef ribs cow ullamco officia pork chop sed adipisicing ut kielbasa ad nostrud.  Rump velit ham, fugiat fatback exercitation short loin venison cupidatat.  Chicken esse laboris ribeye rump, porchetta non exercitation proident bacon id ut ex swine adipisicing.',
    'Nisi hamburger boudin aliquip proident aute brisket tri-tip tail id esse doner.  Cillum esse in pancetta id, bacon labore in consequat pork chop tri-tip.  Cow tempor pancetta excepteur spare ribs ullamco ut in sint capicola tongue mollit.  Sunt laborum leberkas ex proident.  Shankle ribeye jerky, sunt pancetta duis sint ham strip steak.  Commodo et ribeye laboris frankfurter dolor spare ribs short ribs dolore esse jerky deserunt doner jowl.  Consectetur eu cupim aliquip.',
    'Deserunt andouille magna spare ribs, dolor cupidatat id tempor.  Tongue est pork loin short ribs adipisicing consectetur, ut pork chop rump pariatur irure cillum turducken doner.  Ham hock id ham do alcatra in pork chop commodo ut.  T-bone in labore, capicola pig ribeye culpa biltong.  Irure aute aliquip incididunt bacon.',
    'Filet mignon consequat proident, ball tip kielbasa dolore laborum ea shankle sed alcatra.  Hamburger flank sunt eu sint deserunt cow culpa jowl beef ribs andouille pastrami ham.  Duis non in ullamco dolor kielbasa pork chop eu pariatur.  In short ribs bresaola, chuck aute swine consectetur dolore beef ribs laboris.  Aute ut strip steak ullamco quis short loin alcatra commodo.  Minim consequat sunt, filet mignon deserunt velit spare ribs.',
    'Est ham sint reprehenderit rump beef ribs bresaola hamburger boudin id ut ham hock mollit.  T-bone nulla elit, irure leberkas culpa velit salami est nisi.  Landjaeger commodo kielbasa labore nostrud leberkas venison.  Incididunt voluptate eu mollit tongue frankfurter, ball tip t-bone filet mignon meatball bacon chuck cupidatat landjaeger.',
    'Irure in chicken fatback brisket sunt, nostrud meatloaf boudin kevin voluptate short loin kielbasa do.  Tri-tip consequat ribeye ex ut, short ribs picanha eu sed hamburger exercitation excepteur jerky chicken aute.  Chuck consectetur sed aliqua non pastrami duis laboris salami corned beef kielbasa commodo leberkas pork chop.  Ex turkey consequat, fatback eiusmod sint pariatur short ribs aliqua.',
    'Nostrud kevin cupim laboris porchetta, alcatra doner swine deserunt chuck landjaeger ad turducken.  Dolor beef ribs chuck shank exercitation, tempor ground round pork shankle duis t-bone eiusmod laborum spare ribs nostrud.  Jerky consequat shoulder veniam sed velit, eu ribeye.  Culpa eu meatball, adipisicing pork drumstick nostrud.  Salami jowl ham hock in.  Elit ut jowl, frankfurter strip steak rump pariatur exercitation deserunt nostrud tri-tip filet mignon enim.  Sirloin beef irure commodo chuck, kevin sunt culpa bacon tempor adipisicing flank dolore shoulder.',
    'Adipisicing landjaeger voluptate tempor shankle, sed meatloaf reprehenderit tri-tip leberkas do.  Irure exercitation pancetta sausage kevin aliqua adipisicing, jowl culpa fugiat ipsum.  Sausage ball tip pig alcatra salami t-bone.  Bacon do ground round cillum turducken excepteur ham drumstick, mollit nulla prosciutto beef picanha veniam ex.  Swine beef ribs pork loin ipsum sausage eu cupim jerky.  Irure jowl ut aute t-bone.',
    'Elit non shankle fugiat cupim.  Ground round pig laborum flank tempor nulla ad qui lorem hamburger magna.  Shank esse enim venison, t-bone in short loin strip steak nostrud salami minim.  Veniam sed shank aliqua deserunt.  In capicola ham ball tip.',
    'Mollit sirloin alcatra tempor veniam, meatloaf in dolore in tri-tip jerky.  Picanha nulla ham, deserunt nostrud ut officia prosciutto leberkas.  Duis veniam pork belly short ribs proident.  Swine bacon venison sirloin, aute ad tempor est dolor.  Elit beef ribs esse meatball landjaeger labore lorem commodo excepteur ribeye beef strip steak cupim.  Quis shankle non, anim nisi ex aliquip.  Ground round ribeye excepteur ullamco venison.',
    'Kielbasa esse in, ribeye lorem consectetur pig ut.  Flank sirloin ham hock ullamco salami, chicken landjaeger hamburger picanha doner.  Ground round aliquip meatball shoulder deserunt quis.  Occaecat tempor meatloaf in, pariatur brisket cow ball tip consequat swine jowl nulla sirloin laboris.  Cupim pancetta aute sint turducken.  In ad consequat, ut fugiat nostrud corned beef.  Ground round nulla bresaola sunt.',
    'Shankle commodo est corned beef.  Kielbasa filet mignon chuck brisket landjaeger nulla.  In ham hock nulla cillum pancetta duis beef ribs rump.  Labore chuck occaecat beef do.',
    'Nisi pariatur ground round irure brisket quis.  Boudin irure cillum sunt.  Tongue et porchetta, alcatra ham culpa sirloin tempor meatball turducken picanha doner pariatur officia aute.  Esse eu qui enim ut magna laborum pancetta minim lorem tenderloin proident fatback sausage.  Nulla est in veniam, dolore bacon adipisicing laboris aliquip shankle cow in commodo ullamco.  Nostrud turkey meatball sirloin qui.',
    'Sed lorem consequat, est sirloin short ribs exercitation ut ipsum id tail ex labore.  Short ribs doner pig, boudin ipsum quis jerky shankle.  Tempor bacon biltong porchetta hamburger quis picanha incididunt.  Boudin brisket drumstick sunt.  Meatball voluptate dolore minim non mollit.',
    'Aliqua elit filet mignon, short ribs ham hock consequat ipsum leberkas sausage lorem officia meatloaf enim.  Spare ribs ut nisi pastrami ground round labore pancetta laborum leberkas laboris voluptate rump alcatra prosciutto.  Duis et ad ut hamburger labore.  Ball tip non shankle minim nostrud.',
    'Ut pariatur pig, rump dolore fatback leberkas salami ut pork.  Beef irure ex ground round.  Commodo proident porchetta ad beef eiusmod enim officia cow, excepteur salami t-bone culpa ham deserunt.  Tenderloin dolore leberkas, in chicken eu quis turducken andouille esse pancetta consectetur adipisicing culpa.  Biltong esse ullamco chuck porchetta commodo cupidatat beef ribs picanha shoulder dolore t-bone.  Doner veniam pork belly ham shoulder rump.  Exercitation magna ball tip ribeye, shoulder sunt sausage shank capicola fugiat sirloin dolor ham hock swine andouille.',
    'Pork chop reprehenderit frankfurter, exercitation esse cupim ground round chuck swine pig rump excepteur.  Short loin turducken magna ut, eu fugiat nostrud minim.  Culpa landjaeger andouille chicken alcatra et pancetta porchetta frankfurter nostrud swine bacon non leberkas shankle.  Salami short loin picanha anim filet mignon ex minim, nulla ribeye brisket.',
    'Minim meatball ribeye, labore est corned beef id turducken ham hock tenderloin ut ipsum sunt.  Cupim mollit meatloaf sunt, filet mignon nisi aute.  Officia laboris fugiat brisket est, dolore frankfurter.  Enim rump jerky irure beef ribs ex.  Officia flank capicola cupidatat, porchetta laboris tongue shoulder.',
    'Nisi beef ribs venison in rump eu ullamco nostrud brisket chuck.  Ut incididunt hamburger ut kevin.  Pig in cow id meatball eiusmod in jowl picanha, pastrami commodo ex.  Tri-tip non pork chop, doner swine jowl fatback nostrud brisket.  Laborum prosciutto sunt nulla dolore brisket ground round aute proident leberkas.  Ullamco in ad, et enim magna chicken andouille deserunt in elit id ham cow.',
    'Biltong dolore shankle, strip steak enim chicken ham.  Swine irure anim cupidatat, proident salami elit exercitation cow ball tip dolore spare ribs nulla filet mignon in.  Porchetta bresaola kevin frankfurter.  Veniam non fatback andouille ut, aliquip tail.  Ex cow sint tri-tip cillum dolor minim occaecat swine bacon officia id et.',
    'Exercitation alcatra andouille ut.  Et consequat porchetta, pig ribeye short ribs tongue tri-tip magna nulla ipsum dolore shank minim voluptate.  Adipisicing beef pork loin, frankfurter magna flank incididunt.  Turkey tail landjaeger, ball tip ex salami flank bacon qui.',
    'Brisket do ut, in proident prosciutto shank.  In anim drumstick biltong ground round.  Fatback meatball ad, ut biltong do pork chop ex corned beef nisi esse eiusmod.  Cillum lorem pastrami short loin voluptate veniam eu tempor ham meatball ut non reprehenderit nisi biltong.  Rump magna salami pork chop, consectetur picanha ea pancetta in aliquip reprehenderit shank shoulder.  Consequat cupim laboris kevin porchetta esse.  Pariatur dolore salami et, in cow minim shankle jowl tongue proident rump ham hock veniam.',
    'Elit chuck id kevin meatloaf doner ut ea landjaeger tail.  Landjaeger non spare ribs meatloaf, anim id do turducken brisket porchetta in ham hock duis.  Dolor meatball anim leberkas.  Deserunt tenderloin corned beef pork belly.',
    'In salami officia ham hock sunt exercitation ut tenderloin proident elit.  Alcatra adipisicing drumstick, nisi reprehenderit ad do meatball t-bone.  Veniam lorem alcatra, consectetur corned beef mollit meatball shank pancetta.  Sirloin cow filet mignon ribeye meatloaf shankle, meatball non brisket spare ribs sint bacon beef.  Sunt porchetta spare ribs pariatur bacon sirloin pork chop ham hock short ribs non rump nulla.',
    'Ribeye incididunt hamburger tenderloin cillum, jowl deserunt drumstick pastrami short ribs filet mignon.  Consequat ex short ribs consectetur, rump reprehenderit leberkas kevin et occaecat cupidatat exercitation capicola.  Sunt biltong porchetta magna, pancetta cupim jowl beef ribs nulla.  Tempor consequat sed sint pariatur eu adipisicing kielbasa.  Voluptate picanha rump fatback fugiat tenderloin ground round ex aliquip sirloin officia.  Velit boudin irure et, dolore sunt nostrud sirloin.',
    'Et sed shank, laboris proident corned beef rump prosciutto meatball sausage ham hock filet mignon ball tip meatloaf pork loin.  Sed elit pig mollit jerky sint incididunt.  Shankle commodo hamburger dolore bacon cupim, non ball tip t-bone fugiat aute cow in.  Landjaeger cupim swine ullamco.',
    'Short loin aliqua leberkas pork loin salami filet mignon alcatra.  Nisi cupim pork loin lorem cillum ham strip steak filet mignon ex sirloin drumstick cow doner jowl.  Pancetta in laboris, sunt cupim ribeye est.  Pariatur id est, occaecat eu pork belly swine pig chicken voluptate.  Voluptate labore ipsum consectetur qui.',
    'Ipsum exercitation deserunt, dolore nisi eiusmod cillum.  In leberkas ham tenderloin aliqua tail ullamco consectetur anim dolor.  Kielbasa pig biltong meatloaf, flank commodo boudin.  Beef ribs magna ham pariatur, occaecat tenderloin commodo landjaeger.',
    'Eu in ham hock, chuck shank bresaola velit pig consequat enim commodo irure.  Beef ribs sausage ex ham hock swine shank, et shankle dolore occaecat turkey.  Eiusmod in eu pork chop venison.  Magna consequat exercitation kielbasa sausage spare ribs leberkas nostrud pork belly do.  Andouille jowl minim doner fatback ham hock in spare ribs t-bone commodo reprehenderit sunt swine.  Meatball spare ribs eiusmod hamburger short ribs irure labore brisket.  Leberkas pork belly nostrud filet mignon cillum veniam occaecat fatback jerky andouille in do shank.',
    'Cupim shank tongue brisket short ribs velit consectetur aliquip cupidatat.  Commodo meatloaf culpa prosciutto bresaola, biltong veniam beef ribs strip steak chuck aute rump shankle turducken irure.  Capicola sausage adipisicing minim.  Tongue dolor elit venison, in aute brisket ut porchetta sed.  Ham landjaeger flank voluptate sed.',
    'Veniam venison id voluptate anim sausage rump in kielbasa pig.  Excepteur aliquip boudin, sint cupidatat turducken shoulder.  Ribeye cow fatback, pork belly cillum commodo incididunt rump excepteur occaecat eu turkey kielbasa ut beef.  Boudin ut duis nulla ut beef ribs cow, porchetta fatback ground round shoulder cupim bresaola.  Strip steak corned beef ribeye short loin veniam tri-tip ut proident turducken prosciutto est exercitation pastrami excepteur beef.  Duis alcatra dolore leberkas esse deserunt sed voluptate ipsum commodo boudin filet mignon landjaeger.  Consequat andouille cupidatat pastrami aliqua, sint cillum bacon dolore commodo velit.',
    'Nisi commodo tongue rump venison corned beef beef chuck veniam fugiat sint nulla shankle.  Strip steak dolore sunt turkey, salami prosciutto non laborum meatball quis velit.  Sunt tempor prosciutto, id flank reprehenderit nulla consectetur irure sausage pork chop meatloaf meatball ipsum.  Nostrud cow shankle cupidatat alcatra, turkey consectetur et labore qui.  Tempor spare ribs dolore ea, irure duis prosciutto officia esse chicken tri-tip ham excepteur incididunt pariatur.  Elit exercitation voluptate hamburger shoulder filet mignon.',
    'Deserunt frankfurter flank, ad eu voluptate meatloaf.  Sint flank dolore deserunt.  Ea in in beef ribs hamburger tri-tip veniam consectetur tenderloin porchetta.  Filet mignon exercitation incididunt veniam.  Elit pork loin excepteur jerky cow voluptate capicola deserunt boudin.  Pork loin meatloaf shank culpa enim commodo ball tip occaecat fugiat.  Drumstick sint ullamco boudin turkey.',
    'Fugiat short loin jerky alcatra mollit, venison t-bone adipisicing frankfurter pork chop kielbasa esse sint cupim.  Irure fugiat pastrami, tempor flank chuck ham elit duis.  Ea irure aliquip, ipsum t-bone sint nulla duis pig tenderloin meatball eu in.  Turducken veniam picanha, pork in shank pork belly exercitation kevin voluptate dolore porchetta.  Sunt ham dolore labore adipisicing pork loin in corned beef tri-tip est cillum laborum fatback tail swine.',
    'Ham hock salami ball tip picanha ut tongue.  Ball tip shoulder velit, bacon culpa nostrud beef ribs landjaeger short ribs fugiat anim rump excepteur.  Dolor fugiat eiusmod flank pastrami anim pig ham hock pancetta pork chop dolore cupim ut et.  Ut occaecat pork belly ribeye beef ribs, in commodo rump deserunt pig porchetta swine short loin beef.  Commodo elit ea enim id.  Aliqua ball tip boudin picanha anim.',
    'Eiusmod enim officia pork belly proident.  Veniam drumstick pancetta sunt beef magna est pork loin sausage brisket ullamco ham pork chop in.  Sed ea anim culpa tongue hamburger sint jerky cupidatat in bacon officia alcatra.  Kielbasa in qui sed elit lorem et bresaola dolore fatback jowl leberkas spare ribs.  Chicken consequat sausage ham hock voluptate fatback venison laboris.  Non do velit, jerky cupidatat fatback deserunt reprehenderit consequat ut turkey quis est.',
    'Ut tempor kevin flank drumstick, leberkas venison officia pork belly chuck alcatra.  Ullamco pig laborum tenderloin, jowl proident tongue porchetta venison aliqua fatback.  Picanha pariatur prosciutto nostrud.  Proident filet mignon chuck laboris dolore pig meatball hamburger id anim.  Magna culpa excepteur est duis quis ribeye rump ex.  Turkey ad filet mignon, consectetur commodo enim dolor landjaeger kevin pig adipisicing.',
    'Picanha chuck venison officia consectetur swine brisket ex aute et exercitation tempor short ribs non.  Exercitation sint ad ullamco jerky.  Meatloaf bacon pancetta, laboris tongue pork chop laborum anim ut beef ribs shankle doner proident jowl venison.  Hamburger porchetta capicola ribeye shank fatback, sausage strip steak beef ribs tri-tip ham frankfurter pork chop picanha.  Pork belly t-bone shoulder duis in capicola meatball nisi cupim.',
    'Esse ground round ipsum frankfurter.  Duis beef ribs aliqua, quis porchetta capicola exercitation frankfurter flank turducken shoulder.  Turkey culpa enim adipisicing.  Ball tip rump reprehenderit laborum.  Veniam tri-tip do officia nisi irure shankle nostrud beef eu brisket consectetur.  Ea aute shankle, short ribs bresaola tenderloin filet mignon turducken in tri-tip aliqua ut sirloin.',
    'Turducken chicken filet mignon, pork belly pork loin voluptate ut ullamco adipisicing deserunt quis dolore swine capicola.  Est alcatra incididunt, ut filet mignon fugiat labore eiusmod chuck.  Ham labore mollit boudin ipsum est tri-tip beef ribs proident voluptate deserunt sirloin.  Short ribs anim est non frankfurter.',
    'Ham hock sed shank short loin prosciutto adipisicing frankfurter shoulder dolor fatback eiusmod.  In salami sint brisket.  Short loin ad laborum ex.  Laboris adipisicing picanha aliquip, labore spare ribs reprehenderit jerky.',
    'Eiusmod sunt laborum, est qui venison kielbasa.  In ham hock pork chop ham ex incididunt, frankfurter ea shoulder minim veniam officia.  Salami turkey boudin aute landjaeger, shank ut strip steak ipsum eu lorem beef anim.  Duis ad adipisicing, short loin t-bone voluptate sunt salami chicken cillum frankfurter.  Leberkas shankle tri-tip drumstick filet mignon pig jowl est landjaeger, ad pork loin in capicola.  Picanha duis pancetta mollit, short ribs turkey ut meatloaf short loin dolore.  Sausage chicken laborum ullamco do porchetta.',
    'Fatback veniam proident, venison biltong ipsum corned beef occaecat pork chop et labore cow pastrami.  Est officia tenderloin, consequat ea boudin quis landjaeger esse id flank.  Enim pig ham do kielbasa commodo excepteur swine aliqua.  Mollit pork strip steak id.',
    'Cillum elit esse shoulder pork biltong do enim sausage cupim excepteur shank corned beef consequat.  Ut eiusmod aute, ground round salami adipisicing pork ipsum laboris in chuck porchetta doner.  Porchetta in andouille in sint picanha incididunt ea quis.  Occaecat ball tip lorem laboris.  Nostrud sausage tail spare ribs ullamco brisket in ribeye irure excepteur boudin frankfurter doner pancetta labore.',
    'Biltong spare ribs chuck, drumstick irure pariatur consequat voluptate occaecat strip steak non.  Occaecat excepteur tail andouille, pork loin culpa reprehenderit pancetta eu venison.  Commodo culpa doner bacon dolore.  Short ribs andouille meatloaf, fatback laboris sirloin hamburger beef ribs shankle alcatra eiusmod ut tenderloin.',
    'Pastrami turducken duis, tongue capicola kielbasa chicken pork belly andouille in pancetta lorem fugiat ut.  In reprehenderit brisket adipisicing tongue landjaeger.  Quis ut chuck proident prosciutto esse ham turkey ipsum et pork belly do.  Prosciutto occaecat boudin laborum do elit nulla qui short loin cow doner in.  Tongue elit biltong meatloaf.  Minim alcatra pig non ribeye ut lorem voluptate kevin.',
    'Voluptate velit do cillum, short loin est jowl aliquip.  T-bone short loin filet mignon, jowl dolor cupim in laborum.  In salami cow, shoulder flank brisket aliqua boudin consectetur tail ut deserunt elit labore velit.  Leberkas labore sint pork chop.  Doner reprehenderit consequat, adipisicing rump bacon aute pork chop nostrud short ribs andouille dolore ham.  Minim tail doner, lorem non ribeye tongue dolore biltong.  Laboris exercitation hamburger et chicken shankle lorem esse officia dolor kevin ad.',
    'Voluptate eu shank, in minim mollit strip steak velit meatloaf ground round.  Et picanha do bresaola leberkas porchetta dolore mollit consequat jowl enim dolore.  Jerky fatback pancetta anim ut culpa laboris drumstick veniam salami shank short loin pork loin consectetur.  Biltong dolor jerky tri-tip venison, rump ribeye shoulder beef pariatur lorem nulla bacon picanha ground round.  Short loin venison eiusmod strip steak chuck rump brisket adipisicing flank hamburger cillum ut pork loin fatback exercitation.  Cow meatloaf commodo chicken turkey, beef ribs sirloin.',
    'Shoulder dolore frankfurter kielbasa, tenderloin pig flank.  Irure esse flank, short loin sunt laborum cupidatat velit turducken meatball porchetta.  Aliqua drumstick beef anim boudin, dolor ut labore.  Shank commodo irure minim dolore corned beef ham hock voluptate tempor meatloaf non.  Tri-tip do kevin ea sed duis landjaeger ham hock spare ribs rump ball tip meatball adipisicing enim.',
    'Pork alcatra dolore landjaeger pariatur ribeye.  Shank tongue bacon officia non qui sint ut bresaola aliqua frankfurter picanha nulla eiusmod.  Flank filet mignon ipsum, lorem kielbasa incididunt picanha brisket duis drumstick.  Proident pariatur elit, ad jowl in frankfurter fatback dolore.  Ad beef occaecat esse cow, dolore ground round elit alcatra.  Nisi turkey sed, kielbasa labore fatback beef ribs jowl aliqua beef commodo nulla doner.',
    'Pork mollit nisi tail, labore flank tenderloin ribeye occaecat ut.  Spare ribs short loin veniam sint ad in.  Est biltong shoulder dolore venison tail commodo.  Aute shank tongue, dolor ut cow bresaola et.',
    'Beef fugiat cillum spare ribs, in turducken biltong shoulder boudin.  Ground round esse reprehenderit dolore anim swine.  Et tri-tip ad, cillum occaecat in dolore tail ribeye deserunt bacon turducken tongue shoulder.  Cupidatat leberkas landjaeger frankfurter beef, et pariatur dolore adipisicing.  Velit sunt turkey sirloin frankfurter pancetta t-bone.',
    'Alcatra nulla laborum short loin beef ribs dolor.  Doner aute ut anim, excepteur tenderloin laboris lorem ham hock minim filet mignon.  Velit qui do, ham hock anim swine jowl venison ullamco reprehenderit bacon ipsum.  Ball tip cillum in quis exercitation proident cupidatat sirloin rump et pastrami sausage magna corned beef drumstick.  Pastrami landjaeger fugiat porchetta pancetta drumstick beef meatloaf.  Cupidatat aute dolore elit, qui cow minim shank commodo aliqua.',
    'Rump porchetta ham hock culpa ball tip meatloaf fatback swine picanha dolore beef ribs salami.  Ea shankle reprehenderit kielbasa ground round veniam corned beef.  Hamburger elit chuck, corned beef frankfurter tempor porchetta.  Dolore ribeye dolore, chuck shankle nostrud quis hamburger ut jerky non.',
    'Pig drumstick aute reprehenderit adipisicing pork loin doner corned beef ad.  Jowl officia pork quis, hamburger turducken boudin in tempor bresaola.  Nulla tri-tip elit adipisicing anim nostrud.  Nostrud swine qui consectetur occaecat, ham hock et picanha ad venison.  Sint salami ham hock capicola.  Pancetta biltong bresaola, beef ribs deserunt pork tri-tip kielbasa.',
    'Picanha capicola tail cillum salami dolore, filet mignon bacon fatback exercitation sint.  Porchetta nulla in veniam shoulder sed bacon excepteur, alcatra fugiat non pork chop.  Occaecat turkey id, non pastrami aliqua et kevin.  Pariatur esse elit short ribs.  Brisket pancetta cupidatat turkey, beef ribs pariatur prosciutto pork belly alcatra exercitation ball tip veniam ullamco.',
    'Aliqua turkey quis hamburger nostrud.  Excepteur porchetta reprehenderit culpa sausage eiusmod aliquip veniam esse consectetur anim aliqua.  Biltong alcatra tail, irure nulla excepteur tongue brisket ham hock ribeye short loin in.  Laborum bacon sint pancetta dolor, sunt ham aliquip ut enim irure sausage incididunt.',
    'Ea excepteur in, proident qui deserunt meatball elit occaecat short ribs culpa laborum.  Cow beef ribs nisi ribeye, sunt pastrami prosciutto drumstick ipsum sirloin.  Est excepteur pork loin andouille occaecat labore lorem ipsum nisi meatloaf.  Pariatur adipisicing mollit ut aute turducken eu in jerky boudin anim ball tip corned beef ribeye.  Brisket shankle salami, et esse corned beef jerky.  Beef ribs turducken ground round non ribeye proident in pariatur nulla occaecat quis ipsum strip steak excepteur.  Excepteur tongue magna incididunt et kevin in labore cupim pariatur.',
    'Turducken beef drumstick boudin pork belly.  Biltong pork belly shankle, ut leberkas laboris proident est ham cupim doner drumstick ad.  Jerky occaecat capicola pariatur, ut cupidatat proident non drumstick est in ball tip bacon.  Deserunt tri-tip pastrami, incididunt lorem proident sausage pork sed in laborum fatback eiusmod bacon doner.',
    'Kevin velit venison, cillum excepteur ribeye elit.  Pork ut pariatur chuck bacon, sirloin ribeye ullamco mollit.  Dolore sunt anim hamburger in cow spare ribs.  Cupidatat porchetta t-bone elit strip steak, id in capicola chicken venison exercitation mollit filet mignon.',
    'Salami filet mignon rump jerky leberkas picanha, ullamco short ribs pork.  Deserunt pork loin drumstick, andouille quis ham venison do aute laboris tail eu meatloaf.  Spare ribs venison nostrud incididunt in doner reprehenderit jowl porchetta beef sunt duis.  Ribeye esse prosciutto kielbasa, laborum brisket commodo.  Tenderloin commodo pork, esse pork chop tempor prosciutto sausage chicken pork belly cow.',
    'Short loin nisi chuck, velit dolore sirloin qui incididunt salami drumstick tail biltong.  Ball tip landjaeger anim eu officia in nisi laborum porchetta flank pastrami fugiat pork cillum.  Et corned beef chuck consectetur pork belly biltong t-bone eu tenderloin alcatra bacon ut.  Nulla cillum minim bacon swine alcatra kevin shank shankle ham hock.',
    'Laborum t-bone velit pastrami spare ribs kielbasa pork loin est anim minim shank fugiat beef.  Consequat in kevin pork nulla, frankfurter proident rump non ut ground round duis.  Lorem qui kielbasa, tongue enim pariatur t-bone esse aliqua.  In proident esse, brisket short loin mollit quis id alcatra prosciutto spare ribs.  Ball tip meatloaf turkey sed drumstick, qui elit kevin.  Dolore kevin incididunt, aliquip deserunt landjaeger ea aliqua tongue bacon aute.',
    'Anim shoulder biltong picanha strip steak ham non dolor id.  Kevin veniam in non, ribeye brisket swine jowl sunt tempor incididunt laboris hamburger.  Andouille occaecat sunt, consectetur laboris enim pariatur.  Pork chop deserunt lorem tempor ball tip ad aute.  Filet mignon consequat ut, in sint beef ribs spare ribs dolore t-bone kevin cupidatat boudin.  Sed shank in, hamburger pastrami magna venison excepteur spare ribs duis.  Cillum kielbasa commodo shoulder doner corned beef nostrud magna enim sausage.',
    'Porchetta dolore excepteur non strip steak officia adipisicing.  Duis sint doner, tongue officia et nostrud est capicola.  Officia enim exercitation, jerky esse sint shankle voluptate chuck kielbasa ex andouille in.  Sint drumstick beef, short loin hamburger elit ut corned beef consectetur anim.',
    'Exercitation alcatra frankfurter, andouille ribeye mollit dolor tail velit.  Pork loin doner do, meatball jerky sunt mollit.  Do culpa minim, ham hock commodo veniam cupim.  Ut ullamco brisket, veniam eu sint quis ex sunt tempor id lorem pariatur.  Dolore ball tip cupidatat leberkas short ribs pork loin ea tri-tip irure.  Velit frankfurter deserunt et, jerky rump anim ut minim in in nisi.',
    'Ground round do duis landjaeger tail, beef ribs shankle nostrud aliquip dolore cow spare ribs ullamco cupidatat.  Tenderloin laborum anim, jerky ham flank porchetta mollit in pig velit.  Quis duis meatball, short loin dolor landjaeger turkey.  Ut turkey non, beef eu short loin occaecat anim meatloaf.  Landjaeger dolore short ribs proident.  Velit pariatur sed deserunt dolore, sint frankfurter pork loin.  Cupidatat aliqua sunt, ad tenderloin ball tip meatball ut minim nulla.',
    'Cow veniam elit prosciutto in sint, esse alcatra.  Short ribs t-bone et, ribeye ground round tenderloin occaecat.  Sunt picanha brisket, pork chop turducken swine ham hock commodo landjaeger.  Biltong capicola mollit cillum kevin.  Boudin lorem non ipsum, sed deserunt magna pork flank consectetur.  Do ham hock pork chop, swine ut turkey magna jowl.  Tongue in velit chuck occaecat nulla.',
    'Ground round tenderloin in bacon minim aliqua esse aute.  Short ribs veniam non, spare ribs est rump pork loin ipsum quis hamburger porchetta tenderloin aliquip.  Porchetta veniam shoulder, consectetur spare ribs cow dolore occaecat ea ad ham boudin ribeye tail rump.  Brisket excepteur aute pig incididunt ad bresaola sirloin ipsum tongue.  Sed nisi in qui, ea laboris drumstick eiusmod alcatra pariatur velit.',
    'T-bone ut commodo tenderloin short ribs sausage, ea filet mignon cupim.  Lorem pancetta eu pork, adipisicing corned beef sunt ex nisi minim cupim.  Eu non tempor enim ad duis in tenderloin shank laborum, fugiat short ribs picanha.  Sirloin rump leberkas reprehenderit, beef ribs quis in alcatra enim.  Irure bacon filet mignon labore laborum chuck ground round swine.',
    'In exercitation frankfurter, tempor eu officia do tri-tip.  Porchetta turkey ut minim cow hamburger ham beef ribs et cillum leberkas non.  Meatball aliquip in tenderloin, nisi beef leberkas picanha.  Cillum ut beef ut sed enim, laborum qui tri-tip fugiat t-bone bacon do boudin.  Alcatra bacon jerky lorem, sirloin deserunt pork belly turkey culpa consequat prosciutto cupim shank.',
    'Enim hamburger pork loin, pork belly chicken exercitation cupim aute jerky ullamco in.  Consectetur pork tongue biltong boudin eiusmod.  Lorem ut shankle shoulder, andouille boudin laborum reprehenderit pancetta deserunt in.  Exercitation porchetta salami, biltong shoulder spare ribs dolor cupidatat turkey aute est ut aliqua aliquip.  Ex non magna, rump alcatra strip steak eiusmod enim pork chop short ribs irure spare ribs doner jowl chicken.',
    'Tail beef ribs brisket meatloaf.  Pork belly minim commodo, shoulder ground round nulla filet mignon short ribs.  Capicola prosciutto turkey duis.  Leberkas biltong corned beef magna duis ut frankfurter venison veniam lorem swine landjaeger.  Aliqua chicken ex pancetta quis irure boudin culpa labore.  Ribeye dolore filet mignon pork belly tri-tip pork loin id.  Corned beef qui shank, sint laborum porchetta meatball laboris pork tempor pancetta ad tenderloin bacon pariatur.',
    'Salami eu spare ribs, elit sint sirloin beef ribs bacon sunt tenderloin.  Pastrami beef ribs strip steak irure eu voluptate pork chop bacon.  Hamburger flank sirloin culpa.  Ribeye dolore landjaeger, doner sint porchetta drumstick.  Tri-tip eu qui laborum biltong bresaola ipsum short loin bacon jerky enim.  Alcatra kielbasa tongue salami officia.',
    'Tail shankle dolor, nulla proident doner est enim jowl beef ribs meatloaf fatback ground round officia.  Eu aliqua ball tip laborum turkey ham hock pariatur cow aute nostrud sint.  Aute tail tenderloin, est aliquip enim incididunt.  Picanha prosciutto ad consectetur commodo jerky meatball mollit brisket aute reprehenderit pastrami enim veniam.  Filet mignon et tail fugiat eu.',
    'Shankle beef spare ribs, hamburger brisket meatloaf pancetta ut commodo minim deserunt.  Pig picanha nulla enim.  Ribeye ex short ribs, pork turducken esse tail ham sirloin tongue andouille aute.  Landjaeger occaecat dolore fatback sint venison.  Venison filet mignon non, cow cupim in in fatback bacon sirloin shoulder irure.',
    'Ipsum id tongue, nostrud kielbasa cupidatat reprehenderit nisi mollit cupim veniam tail sint landjaeger.  Cupidatat aliquip salami rump officia ut.  Esse incididunt duis aliqua t-bone.  Drumstick eiusmod velit pork belly turkey boudin voluptate esse commodo pastrami aliqua ham irure laboris pancetta.  Et pastrami jowl, excepteur chicken nostrud ut dolor fugiat ham.  Nostrud turkey dolor, kevin occaecat elit ut tenderloin sint leberkas pork loin pariatur pancetta landjaeger.',
    'Eiusmod velit dolor, frankfurter ut adipisicing laborum veniam turkey consequat sausage irure.  Nostrud tempor minim, sirloin swine fatback tongue shankle meatball do brisket dolore porchetta ut sint.  Tri-tip occaecat nulla tempor ad jerky nostrud excepteur andouille et magna short loin duis capicola.  Incididunt aute shankle, pork jerky venison turducken do pig labore et.  Short loin reprehenderit leberkas tail.',
    'Beef aliqua quis cow reprehenderit alcatra, officia dolor.  Turkey venison drumstick, ribeye ham porchetta ut.  Pig dolor ea, nulla aliquip alcatra short ribs.  Ullamco beef brisket lorem dolor et incididunt short loin tempor ut bacon eu qui labore prosciutto.',
    'Ribeye spare ribs reprehenderit corned beef porchetta, velit laborum strip steak short loin et mollit pastrami.  Tri-tip aliqua chuck ut ball tip.  Ball tip sausage aliquip capicola.  Strip steak non anim shoulder, in andouille nostrud.  Tail mollit chicken ullamco.',
    'Landjaeger doner pig meatball commodo short loin venison ut nostrud reprehenderit capicola non turkey quis brisket.  Lorem kielbasa turducken ball tip, sirloin esse drumstick chuck meatloaf shankle porchetta tenderloin chicken ex.  Incididunt mollit short loin non, veniam lorem pork loin adipisicing meatball.  Chicken qui consectetur tongue shankle, in shank sirloin rump ut drumstick id elit.  Tempor duis cupim rump ullamco ex frankfurter beef hamburger andouille flank sausage anim.  Shankle ball tip tail aute picanha swine salami alcatra voluptate occaecat.',
    'Eiusmod reprehenderit excepteur pork loin aliqua boudin, do bresaola.  Sirloin ea pancetta tenderloin pork aute bacon proident lorem incididunt irure.  Ball tip short loin id consectetur, in prosciutto in incididunt laborum spare ribs sirloin porchetta nostrud biltong.  In voluptate chuck, culpa cupim et aliqua ribeye.  Quis ham chuck pork belly.'
  );

    public function random_number($digits){
      return rand(pow(10, $digits - 1) - 1, pow(10, $digits) - 1);
    }

    public function random_phone_number(){
      return '+56 9 '.self::random_number(8);
    }

    public function random_rut(){
      return number_format(self::random_number(7) , 0 , "," , ".").'-'.self::random_number(1);
    }

    public function create_email_from_name($name, $organization = false){
      if(!$organization){
        $domain = 'gmail.com';
      }else{
        $domain = strtolower(preg_replace("/[^A-Za-z0-9]/", "", $organization)).'.com';
      }
      return mb_ereg_replace("\ ",".",mb_strtolower($name).'@'.$domain);
    }

    public function random_date($lower, $higher){

      $lower = strtotime($lower);
      $higher = strtotime($higher);

      return date("Y-m-d",mt_rand($lower,$higher));

    }

    public function populateTest($answers)
    {

      $test = array();
      $test['b'] = 0;
      $test['c'] = 0;
      $test['i'] = 0;
      $test['a'] = 0;

      for($y = 0; $y < 16; $y++){
        $test['b'] = $test['b'] + $answers[$y][0];
        $test['c'] = $test['c'] + $answers[$y][1];
        $test['i'] = $test['i'] + $answers[$y][2];
        $test['a'] = $test['a'] + $answers[$y][3];
      }

      $test['code'] = 'code';
      $test['name'] = 'name';
      $test['style'] = 'style';

      return $test;
    }

    public function create_profile_record($name, $sex){

      /** Perfil **/

      $profile = Profile::create([
        'name' => $name,
        'organization_id' => 2,
        'is_employee' => rand(0,4) < 1,
        'birthday' => self::random_date('1960-01-01', '1997-01-01'),
        'phone' => self::random_phone_number(),
        'sex' => $sex,
        'id_num' => self::random_rut(),
        'id_type' => 'rut',
        'email' => self::create_email_from_name($name),
        'profile_test_id' => null
      ]);

      /** Atributos **/

      $attributes = array();

      do{
        $attributes[] = mt_rand(1,19);
      } while(count($attributes) < 5);

      $profile->attributes()->sync($attributes);

      /** Tests **/

      $all = array(1,2,3,4);
      $answers = array();

      for($y = 0; $y < 16; $y++){
        $temp = $all;
        $answers[$y] = array();
        for($x = 0; $x < 4; $x++) {
          $value = array_splice($temp, mt_rand(0,count($temp)-1),1);
          $answers[$y][] = $value[0];
        }
      }

      $test = self::populateTest($answers);

      $profile->test()->create([
        'answers' => $answers
      ]);


      /** Empleos **/

      $jobs = mt_rand(0,5);

      $start_date = self::random_date('2000-01-01', date("Y-m-d"));

      for($i = 0; $i < $jobs; $jobs++){
        $end_date = (mt_rand(0,2)>0)?self::random_date($start_date, date("Y-m-d",strtotime($start_date)+mt_rand(1,48)*86400*30)):null;
        if(strtotime($end_date) > time()) $end_date = null;
        $groupi = mt_rand(0,(count(self::$jobs)-1));
        $ref_name = self::$reference_names[(mt_rand(0,count(self::$reference_names)-1))];
        $employer = self::$jobs[$groupi]['employers'][mt_rand(0,count(self::$jobs[$groupi]['employers'])-1)];
        $position = self::$jobs[$groupi]['positions'][mt_rand(0,count(self::$jobs[$groupi]['positions'])-1)];
        $description = self::$baconipsum[mt_rand(0,(count(self::$baconipsum)-1))]."\n\n".self::$baconipsum[mt_rand(0,(count(self::$baconipsum)-1))];
        $profile->jobs()->create([
          'employer' => $employer,
          'position' => $position,
          'description' => $description,
          'reference_name' => $ref_name,
          'reference_phone' => self::random_phone_number(),
          'reference_email' => self::create_email_from_name($ref_name, $employer),
          'start' => $start_date,
          'end' => $end_date
        ]);
        if(!$end_date){
          break;
        }else{
          $start_date = self::random_date($end_date, date("Y-m-d"));
        }
      }

      /** Notas **/

      $notes = mt_rand(0,10);

      for($i = 0; $i < $notes; $i++){
        $note = self::$baconipsum[mt_rand(0,(count(self::$baconipsum)-1))];
        $profile->notes()->create([
          'user_id' => mt_rand(1,2),
          'profile_note_type_id' => mt_rand(1,5),
          'content' => $note,
        ]);
      }

    }

    public function run()
    {

      ProfileNoteType::create([
        'organization_id' => 2,
        'name' => 'Grave',
        'score' => -10,
        'color' => '83142A'
      ]);

      ProfileNoteType::create([
        'organization_id' => 2,
        'name' => 'Negativo',
        'score' => -1,
        'color' => 'A70000'
      ]);

      ProfileNoteType::create([
        'organization_id' => 2,
        'name' => 'Neutro',
        'score' => 0,
        'color' => '63636A'
      ]);

      ProfileNoteType::create([
        'organization_id' => 2,
        'name' => 'Positivo',
        'score' => 1,
        'color' => '42C74B'
      ]);

      ProfileNoteType::create([
        'organization_id' => 2,
        'name' => 'Super',
        'score' => 2,
        'color' => '38A330'
      ]);

      foreach(self::$names['m'] as $name){
        $names[$name] = 'm';
      }

      foreach(self::$names['f'] as $name){
        $names[$name] = 'f';
      }

      do{
        $current = array_splice($names, mt_rand(0,count($names)-1),1);
        foreach($current as $name => $sex){
          self::create_profile_record($name, $sex);
        }
      }while(count($names));

    }
}
