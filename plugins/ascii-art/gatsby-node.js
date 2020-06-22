const fs = require('fs').promises;
const glob = require('glob');

const ART = `

                 ,@NN@@gg,
                ]@C     "*%@mg,
               )$C           "*%@g                             ,,,,,,
              ,@F                "%@g                  ,gg@@NM**""""**MN%@w
              ]@                    *$g           ,g@@M*'                $@
              ]$                      %@g      ,g@M"                     @@
              ]$                       '%@   ,@@'                       ]@F
              ]@C                        %@ g@"                         @@
               $$                        '@@@'                        ,@@
                $@                        @@'                        g@F
                 %@                       $@                       ,@@"
                  ]@g                    j@F                      g@F
                  ,]@@g                  $@                    ,@@P
              ,g@M"' '%@@,,             g$Ngg,             ,g@@M'
           ,@M"         '"*MMNBBBBBB%B@@P" 'j$@g,,,,,,,gg@@N*"*@g
         g@"                          "%@@@@@P"**MMMM**"'       "@g
       gN'                                                        *@g
     ,@"                                                            1@w
    /@      ,g@g,,                ,@                                 "%g
   ]@      g@$C ""*MB@@ggg,     g@F]@                      4m,         %@
  ]$     ,@F]@*MN@gg,   '""*N@m@F   $g                  ,,,gg$@g        %@
 ,@C    ;@' $F     "*MN@@gg,g@F      $g   ,,,ggg@@NNNM**""'' ,,$@        $@
 $@    ,@' j@Ngg,,        ]@F         %@@*"'       ,,,ggm@NM*"""$@       ]@r
,@F   ,@C  $@   '"*MN@@gg@N            "%@@MMM****""''          "$g       $@
]$   ,@F   $$"MNB@@mgggg@'               "$g              ,,gg@@NN@L      ]@r
$$   $@    ]$        ,@@                   *@@,    ,gg@NM*"'',gg@M$@       $@
$$  j@'     $L      1@"                      '*%@@$,,,gg@@M*"'    ]$F      $$
]@  $$      $@     #@                            '"M%@@ggg,,      ]@P      $$
 %@ $@      '$L   )$'      g@@                     g@@, '""*MN@@@@@@F  ,,  $$
 '$g$@      j@@  ,@@      ]@@@P                    $@@@       ]@F      ]$ ,@K
  '%@@      ]$$@ $$P      $@$@                     ]@@@       j@P      @F ]$
          ,@N$ %@@$F      '""                        ''       ]$F     $@  @@
       ,g@M' $W "'$K                 '._____.'                $@     j$C j@L
  ;@@@M*'    ]@   ]@,                                        ]@F    ,@F  '@@
    "%@@g,,   $@   "%@g,                                   ,g@F    g@F    "$@
        "*NB@@@$g    $$*%@@Ngg,,,                ,,,ggg@@@@P'    ,@@'      '%@@
          ,@@" "$g    $W    '""*MM@$@@NBB@@@%@@@MM*""''- $@    ,g@Qggg@@@@@@@@N"
          *NNNNNNN@g  "$g     ,g@M$lj@k     ]@l%%@,     g@'  ,@@F $@"'
                  '%@@g,%g  g@MMlllll%@@NNN@$M$lll%@g,,@$gg@@$,,  $@
                      "%@@@@$$$W, *&ll$@   @@l$l&M*']N@@P"$@M*MNNNBM
                        ,g$@@@@@gl@,'"Y$@ $@*"',wg$$@@@MMM&@,
                       @"]g ,"%@R%@@g@gl$@$W$$@@@@@$F $  g '$g

`;

exports.onPostBuild = async () => {
  let paths = await new Promise((resolve, reject) => {
    glob('./public/**/*.html', (err, paths) => err ? reject(err) : resolve(paths));
  });

  let promises = paths.map(async path => {
    if ((await fs.stat(path)).isDirectory()) {
      return;
    }
    let content = await fs.readFile(path, { encoding: 'utf8' });
    content = content.replace('<!DOCTYPE html>', dt => `${dt}<!--${ART}-->`);
    await fs.writeFile(path, content);
  });

  await Promise.all(promises);
};
